## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## My recommended MVP stack

```bash
Next.js
TypeScript
Tailwind
shadcn/ui
Tiptap

PostgreSQL
Drizzle ORM
pgvector

OpenAI
  ├── LLM
  ├── embeddings
  ├── speech-to-text
  └── image generation

Object storage
```

## Architecture

```bash
                    ┌───────────────┐
                    │    Next.js    │
                    │   Web Client  │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
             Notes UI                AI UI
                │                       │
                └───────────┬───────────┘
                            │
                    Application Layer
                            │
        ┌───────────┬───────┼────────┬──────────┐
        ▼           ▼       ▼        ▼          ▼
      Notes        AI     Search    Voice      Media
        │           │       │        │          │
        │           ▼       ▼        ▼          ▼
        │        OpenAI  pgvector  Speech    Storage
        │
        ▼
   PostgreSQL
    + Drizzle
    ```