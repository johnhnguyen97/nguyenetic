import Anthropic from '@anthropic-ai/sdk'
import { ask } from '../client'

async function main() {
  console.log('Running smoke test against claude-haiku-4-5-20251001...')

  const text = await ask('Reply with the single word: ok', { model: 'haiku', cache: false })

  // Grab usage by making a direct call for token count
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const raw = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16,
    messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
  })

  console.log('Response:', text)
  console.log(
    'Token usage (second call):',
    `input=${raw.usage.input_tokens} output=${raw.usage.output_tokens}`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error('Smoke test FAILED:', err)
  process.exit(1)
})
