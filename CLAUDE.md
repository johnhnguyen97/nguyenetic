# nguyenetic

Portfolio/business website for Nguyenetic.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **Styling**: Tailwind CSS v4 (PostCSS plugin)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI**: Vercel AI SDK + OpenAI
- **Validation**: Zod v4

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Architecture

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── api/             # API routes (if needed)
├── components/
│   ├── layout/          # Header, Footer, Nav
│   ├── ui/              # Reusable UI components
│   └── sections/        # Page sections (Hero, About, etc.)
└── lib/
    └── utils.ts         # Utility functions (cn, etc.)
```

### Styling (Tailwind v4)

Tailwind v4 uses CSS-first configuration:
- Config in `src/app/globals.css` using `@theme`
- No separate `tailwind.config.js` needed
- Use `@apply` sparingly, prefer utility classes

```css
@import "tailwindcss";

@theme {
  --color-primary: #your-color;
  --font-sans: "Geist", system-ui, sans-serif;
}
```

### Components

Use `clsx` + `tailwind-merge` for conditional classes:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Critical Rules

### Security
- Never expose API keys in client code
- Use server actions or API routes for sensitive operations
- Validate all user input with Zod

### Performance
- Use `next/image` for images
- Lazy load below-fold sections
- Use Suspense for async components

### SEO
- Add metadata to each page
- Use semantic HTML
- Include proper Open Graph tags

## Deployment

Target: Vercel
- `development` branch → Preview deployments
- `main` branch → Production

## GitHub

Repository: `johnhnguyen97/nguyenetic`
