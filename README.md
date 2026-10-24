# 🤖 Nexus AI - Full-Stack Streaming AI Chatbot

A full-stack, production-grade AI chatbot web application built with **Next.js (App Router)** and the **Vercel AI SDK**. Features real-time progressive token streaming via Server-Sent Events (SSE), 100% free AI models via Groq LPUs, an offline local simulator mode, persistent multi-session conversation history across page refreshes, and a ChatGPT / Claude inspired UI design.

Built in accordance with the **AI-Powered Chatbot Web Assignment** specifications.

---

## 🌟 100% Free Models Available

This project is tailored specifically to use **only free models** so you can test and deploy without spending money or entering credit cards:

1. **Llama 3.3 70B (`groq/llama-3.3-70b-versatile`)** — Meta's flagship 70B model with state-of-the-art reasoning, 100% free via Groq LPUs.
2. **Llama 3.1 8B Instant (`groq/llama-3.1-8b-instant`)** — Blazing fast lightweight model for instant answers.
3. **Mixtral 8x7B (`groq/mixtral-8x7b-32768`)** — Mixture-of-experts model with 32k context length.
4. **Demo Assistant (Offline Simulator)** — Local streaming simulator requiring **zero keys** and **zero setup**.

---

## 🔑 How to Set Your Free Groq API Key

1. **Get your free key in 30 seconds** (No credit card required):
   - Visit [console.groq.com/keys](https://console.groq.com/keys)
   - Sign in with Google or GitHub
   - Click **Create API Key** and copy it (starts with `gsk_...`)

2. **Add to `.env.local`**:
   Open or create `ai-chatbot/.env.local` and paste your key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

3. **Restart dev server** (if running):
   ```bash
   npm run dev
   ```

---

## 📁 Project Folder Structure

```text
ai-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts            # Server-side streaming endpoint (Vercel AI SDK streamText)
│   │   └── models/
│   │       └── route.ts            # Provider status & available models endpoint
│   ├── favicon.ico                 # App icon
│   ├── globals.css                 # Custom scrollbar, typography & Tailwind styles
│   ├── layout.tsx                  # Root layout with Geist font & metadata
│   └── page.tsx                    # Chat page entry point
├── components/
│   ├── chat/
│   │   ├── chat-container.tsx      # Main chat container orchestrator
│   │   ├── chat-input.tsx          # Auto-resizing input field with send & stop buttons
│   │   ├── code-block.tsx          # Syntax highlighted code block with copy action
│   │   ├── empty-state.tsx         # Welcome screen with interactive prompt cards
│   │   ├── message-item.tsx        # Message bubble with markdown and copy buttons
│   │   ├── message-list.tsx        # Scrollable message list with auto-scroll logic
│   │   └── typing-indicator.tsx    # Animated 3-dot pulse typing indicator
│   ├── layout/
│   │   ├── header.tsx              # Top navigation bar (branding, model selector, new chat)
│   │   └── sidebar.tsx             # Collapsible session / conversation history drawer
│   └── ui/
│       ├── avatar.tsx              # Glowing bot and user avatars
│       ├── button.tsx              # Reusable button with variants
│       ├── dropdown.tsx            # Model selection dropdown with provider badges
│       └── toast.tsx               # Notification toast for copy & session actions
├── hooks/
│   ├── use-chat-session.ts         # Session lifecycle, localStorage persistence & AI SDK useChat
│   └── use-scroll-to-bottom.ts     # User scroll tracking & auto-scroll hook
├── lib/
│   ├── ai/
│   │   ├── mock-stream.ts          # Zero-setup local streaming simulator
│   │   ├── models.ts               # Model registry & provider key checks
│   │   └── providers.ts            # Dynamic provider instantiation for Groq free models
│   ├── constants.ts                # Available free models, starter prompts & storage keys
│   ├── storage.ts                  # LocalStorage helpers with error resilience
│   └── utils.ts                    # Styling & text extraction utilities (cn, copyToClipboard)
├── types/
│   └── chat.ts                     # TypeScript interfaces for messages, sessions, models
├── public/
│   └── AI-Powered Chatbot Web Assignment.pdf
├── .env.example                    # Free key template
├── .env.local                      # Local secrets (git-ignored)
├── package.json                    # Project dependencies and build scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Documentation
```

---

## 🚀 Running the App

```bash
cd ai-chatbot

# Development server
npm run dev

# Production build test
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.
