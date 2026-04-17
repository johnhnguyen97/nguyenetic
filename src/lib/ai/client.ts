import Anthropic from '@anthropic-ai/sdk'
import type { MessageParam } from '@anthropic-ai/sdk/resources'
import { createHash } from 'crypto'

export class ClaudeConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClaudeConfigError'
  }
}

export class ClaudeAPIError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ClaudeAPIError'
    this.status = status
  }
}

export class ClaudeTimeoutError extends Error {
  constructor() {
    super('Claude API request timed out after 30 seconds')
    this.name = 'ClaudeTimeoutError'
  }
}

export type ClaudeModel = 'haiku' | 'sonnet' | 'opus'

const MODEL_IDS: Record<ClaudeModel, string> = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-7',
}

export interface AskOptions {
  model?: ClaudeModel
  system?: string
  maxTokens?: number
  temperature?: number
  cache?: boolean
}

export interface StreamOptions extends AskOptions {
  onDelta?: (text: string) => void
}

// eslint-disable-next-line prefer-const
export let requestTimeout = 30_000

// Simple LRU cache — 100 entry cap
const lruCache = new Map<string, string>()
const LRU_MAX = 100

function lruGet(key: string): string | undefined {
  const val = lruCache.get(key)
  if (val !== undefined) {
    // Refresh recency: delete + re-insert
    lruCache.delete(key)
    lruCache.set(key, val)
  }
  return val
}

function lruSet(key: string, val: string): void {
  if (lruCache.size >= LRU_MAX) {
    const oldest = lruCache.keys().next().value
    if (oldest !== undefined) lruCache.delete(oldest)
  }
  lruCache.set(key, val)
}

function cacheKey(
  model: string,
  system: string | undefined,
  prompt: string,
  maxTokens: number,
  temperature: number,
): string {
  const raw = `${model}|${system ?? ''}|${prompt}|${maxTokens}|${temperature}`
  return createHash('sha256').update(raw).digest('hex')
}

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key || key.trim() === '') {
    throw new ClaudeConfigError(
      'ANTHROPIC_API_KEY is missing or empty. Set it in .env.local.',
    )
  }
  return new Anthropic({ apiKey: key })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ClaudeTimeoutError()), ms),
    ),
  ])
}

function isCacheEnabled(opts?: AskOptions): boolean {
  if (opts?.cache === false) return false
  if (opts?.cache === true) return process.env.NODE_ENV !== 'production'
  // default: enabled in dev, disabled in prod
  return process.env.NODE_ENV !== 'production'
}

function wrapAPIError(err: unknown): never {
  if (err instanceof ClaudeConfigError || err instanceof ClaudeTimeoutError) {
    throw err
  }
  if (err instanceof Anthropic.APIError) {
    throw new ClaudeAPIError(err.message, err.status)
  }
  throw new ClaudeAPIError(String(err))
}

export async function ask(prompt: string, opts?: AskOptions): Promise<string> {
  const model = opts?.model ?? 'haiku'
  const maxTokens = opts?.maxTokens ?? 1024
  const temperature = opts?.temperature ?? 0.7

  if (isCacheEnabled(opts)) {
    const key = cacheKey(model, opts?.system, prompt, maxTokens, temperature)
    const cached = lruGet(key)
    if (cached !== undefined) return cached

    try {
      const client = getClient()
      const messages: MessageParam[] = [{ role: 'user', content: prompt }]
      const response = await withTimeout(
        client.messages.create({
          model: MODEL_IDS[model],
          max_tokens: maxTokens,
          temperature,
          ...(opts?.system ? { system: opts.system } : {}),
          messages,
        }),
        requestTimeout,
      )

      const text = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('')

      lruSet(key, text)
      return text
    } catch (err) {
      wrapAPIError(err)
    }
  }

  try {
    const client = getClient()
    const messages: MessageParam[] = [{ role: 'user', content: prompt }]
    const response = await withTimeout(
      client.messages.create({
        model: MODEL_IDS[model],
        max_tokens: maxTokens,
        temperature,
        ...(opts?.system ? { system: opts.system } : {}),
        messages,
      }),
      requestTimeout,
    )

    return response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
  } catch (err) {
    wrapAPIError(err)
  }
}

export async function askStream(
  prompt: string,
  opts?: StreamOptions,
): Promise<string> {
  const model = opts?.model ?? 'haiku'
  const maxTokens = opts?.maxTokens ?? 1024
  const temperature = opts?.temperature ?? 0.7

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), requestTimeout)

  try {
    const client = getClient()
    const messages: MessageParam[] = [{ role: 'user', content: prompt }]
    let fullText = ''

    const stream = client.messages.stream(
      {
        model: MODEL_IDS[model],
        max_tokens: maxTokens,
        temperature,
        ...(opts?.system ? { system: opts.system } : {}),
        messages,
      },
      { signal: controller.signal },
    )

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const chunk = event.delta.text
        fullText += chunk
        opts?.onDelta?.(chunk)
      }
    }

    return fullText
  } catch (err) {
    if (controller.signal.aborted) throw new ClaudeTimeoutError()
    wrapAPIError(err)
  } finally {
    clearTimeout(timer)
  }
}

export async function chat(
  messages: MessageParam[],
  opts?: AskOptions,
): Promise<string> {
  const model = opts?.model ?? 'haiku'
  const maxTokens = opts?.maxTokens ?? 1024
  const temperature = opts?.temperature ?? 0.7

  try {
    const client = getClient()
    const response = await withTimeout(
      client.messages.create({
        model: MODEL_IDS[model],
        max_tokens: maxTokens,
        temperature,
        ...(opts?.system ? { system: opts.system } : {}),
        messages,
      }),
      requestTimeout,
    )

    return response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
  } catch (err) {
    wrapAPIError(err)
  }
}
