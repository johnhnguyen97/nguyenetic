# `src/lib/ai` — Shared Claude Client

Thin wrapper around `@anthropic-ai/sdk`. All four AI-powered `/work/*` apps import from `@/lib/ai`.

**Never call Claude directly from client components.** Use a server action or `/api/*` route that calls these functions server-side.

---

## API

### `ask(prompt, opts?)` — single-turn, returns full text

```ts
import { ask } from '@/lib/ai'

const reply = await ask('Summarize this review: "Great food, slow service."')
// → "The reviewer enjoyed the food but found the service too slow."
```

### `askStream(prompt, opts?)` — streaming, invokes `onDelta` per chunk

```ts
import { askStream } from '@/lib/ai'

let output = ''
const full = await askStream('Translate this estimate...', {
  model: 'sonnet',
  onDelta: (chunk) => {
    output += chunk
    setPartialText(output) // update React state per chunk
  },
})
```

### `chat(messages, opts?)` — multi-turn conversation

```ts
import { chat } from '@/lib/ai'
import type { MessageParam } from '@anthropic-ai/sdk/resources'

const messages: MessageParam[] = [
  { role: 'user', content: 'What is the capital of France?' },
  { role: 'assistant', content: 'Paris.' },
  { role: 'user', content: 'What is its population?' },
]
const reply = await chat(messages, { model: 'haiku' })
```

---

## Options

| Option | Type | Default | Notes |
|-|-|-|-|
| `model` | `'haiku' \| 'sonnet' \| 'opus'` | `'haiku'` | See model guidance below |
| `system` | `string` | — | System prompt |
| `maxTokens` | `number` | `1024` | Max response tokens |
| `temperature` | `number` | `0.7` | 0–1 |
| `cache` | `boolean` | dev=true, prod=false | Dev-only in-memory LRU cache |

---

## Model selection

| Model | Use case | Cost |
|-|-|-|
| `haiku` | Single review response, SMS draft, waste item categorization, cheap ops | Lowest |
| `sonnet` | Report-quality multi-section outputs, estimate translation | Medium |
| `opus` | Complex reasoning, long-form documents | Highest |

Default is `haiku` — only upgrade when output quality requires it.

---

## Error handling

```ts
import { ask, ClaudeConfigError, ClaudeAPIError, ClaudeTimeoutError } from '@/lib/ai'

try {
  const text = await ask('Hello', { model: 'haiku' })
} catch (err) {
  if (err instanceof ClaudeConfigError) {
    // ANTHROPIC_API_KEY missing — check .env.local
  } else if (err instanceof ClaudeAPIError) {
    // 4xx/5xx from Anthropic — err.status has the HTTP code
  } else if (err instanceof ClaudeTimeoutError) {
    // Request exceeded 30s — retry or fall back
  }
}
```

---

## Cache

The in-memory LRU cache (100-entry cap, keyed by `sha256(model+system+prompt+maxTokens+temperature)`) is **only active when `NODE_ENV !== 'production'`**. It avoids repeat API calls during local development and hot-reloads. It does not persist to disk. Pass `cache: false` to disable per-call.

---

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local`. Throws `ClaudeConfigError` immediately if absent.
