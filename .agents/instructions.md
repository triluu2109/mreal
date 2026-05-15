# M-Real Estate — Project Instructions

> Đây là file hướng dẫn chuẩn hoá cho AI agents làm việc trong project M-Real Estate.
> Đọc file này TRƯỚC khi thực hiện bất kỳ thay đổi nào trong codebase.

---

## 1. Project Overview

**M-Real Estate** — Website landing page bất động sản cao cấp tại Việt Nam.

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Database**: Supabase (PostgreSQL) + **Prisma ORM** (v7)
- **Prisma Driver**: `@prisma/adapter-pg` + `pg`
- **AI Chatbot**: Google Gemini API (`@google/generative-ai`)
- **Form**: React Hook Form + Zod
- **Animation**: Framer Motion

---

## 2. Directory Structure

```
mreal/
├── .agents/                    # Agent instructions & context
│   ├── AGENTS.md               # PRD / Product spec đầy đủ
│   ├── instructions.md         # File này — hướng dẫn cho agents
│   ├── database-schema.md      # Prisma schema + SQL reference
│   ├── design-system.md        # Design tokens & component guide
│   └── skills/                 # Agent skill modules
│
├── prisma/
│   └── schema.prisma           # Prisma schema (models, enums)
│
├── prisma.config.ts            # Prisma 7 config (DB URL)
│
├── generated/                  # Prisma Client (auto-generated, DO NOT edit)
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public routes group
│   │   │   ├── page.tsx        # Trang chủ
│   │   │   ├── about/          # Về chúng tôi
│   │   │   ├── contact/        # Liên hệ
│   │   │   └── news/           # Tin tức
│   │   ├── admin/              # Admin dashboard (protected)
│   │   │   ├── page.tsx        # Dashboard stats
│   │   │   ├── appointments/   # Quản lý lịch hẹn
│   │   │   ├── chatbot-leads/  # Lead từ chatbot
│   │   │   └── news/           # CRUD bài viết
│   │   ├── api/                # API Routes
│   │   │   ├── chat/           # Gemini chatbot proxy
│   │   │   ├── appointments/   # CRUD appointments
│   │   │   └── contacts/       # Form liên hệ
│   │   ├── actions/            # Server Actions
│   │   │   ├── appointment.ts
│   │   │   └── contact.ts
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Tailwind v4 + design tokens
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (DO NOT edit manually)
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── sections/           # Homepage sections (Hero, Services, etc.)
│   │   ├── chatbot/            # Chatbot widget components
│   │   ├── admin/              # Admin-only components
│   │   └── shared/             # Reusable components (cards, forms, etc.)
│   │
│   ├── lib/
│   │   ├── prisma.ts           # Prisma Client singleton (server-only)
│   │   ├── gemini.ts           # Gemini API client & system prompt
│   │   └── utils.ts            # cn() + utility functions
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── use-chatbot.ts
│   │
│   └── types/                  # Shared TypeScript types
│       └── index.ts
│
├── public/
│   ├── images/                 # Static images
│   │   ├── hero/
│   │   ├── projects/
│   │   ├── team/
│   │   └── blog/
│   └── favicon.ico
│
├── .env.local.example          # Template env variables
├── .env.local                  # Actual env (GITIGNORED)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 3. Coding Conventions

### File Naming
- **Pages**: `page.tsx` (Next.js convention)
- **Components**: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-chatbot.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `gemini.ts`)
- **Server Actions**: `kebab-case.ts` in `app/actions/`

### Component Rules
- **Server Components by default** — thêm `"use client"` chỉ khi cần
- **shadcn/ui components**: Luôn install qua `npx shadcn@latest add <component>`, KHÔNG viết thủ công
- **Custom components**: Đặt trong `components/` (không phải `components/ui/`)
- Dùng `cn()` từ `@/lib/utils` để merge class names

### Imports
```typescript
// Đúng — dùng alias @/
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Sai — relative path
import { cn } from "../../lib/utils"
```

### TypeScript
- Strict mode bật — không dùng `any`
- Luôn type props của components
- Dùng `interface` cho props, `type` cho unions/aliases

---

## 4. Design System

### Brand Colors
| Token | Hex | Dùng cho |
|-------|-----|----------|
| Primary Gold | `#C89B2F` | CTAs, highlights, accents |
| Primary Navy | `#1F2A5A` | Header, headings, footer |
| White | `#FFFFFF` | Backgrounds |
| Gray BG | `#F5F6F8` | Section backgrounds |
| Gray Text | `#6B7280` | Muted text |

### Typography
- **Heading**: Montserrat (Google Font)
- **Body**: Inter (Google Font)

### Design Philosophy
- Corporate luxury minimalism
- Nhiều whitespace, grid rõ ràng
- Micro-animations nhẹ nhàng (Framer Motion)
- Focus state màu gold (#C89B2F)

---

## 5. Environment Variables

Xem `.env.local.example` để biết tất cả biến môi trường cần thiết.

**Bắt buộc để chạy local:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `ADMIN_PASSWORD`

---

## 6. Database (Supabase + Prisma)

Xem `.agents/database-schema.md` để biết đầy đủ schema.

**Kiến trúc database:**
- **Supabase** = host PostgreSQL (RLS, Realtime, Storage)
- **Prisma ORM** = type-safe database access từ Next.js server code
- Prisma kết nối thẳng vào Supabase PostgreSQL qua `DATABASE_URL` (connection pooling qua Supabase Pooler)
- **KHÔNG dùng Supabase JS client cho data queries** — dùng Prisma thay thế
- Supabase JS client chỉ dùng cho: Auth (nếu sau này cần), Storage, Realtime

**Models (Prisma):**
- `Appointment` — Lịch hẹn tư vấn từ form
- `ChatbotLead` — Lead từ chatbot Gemini
- `NewsPost` — Bài viết blog
- `Contact` — Form liên hệ

**Prisma Client Singleton** (`src/lib/prisma.ts`):
```typescript
import { PrismaClient } from '../../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**RLS Policy**: Vẫn bật trên Supabase. Prisma bypass RLS qua `DATABASE_URL` (Postgres direct connection).

---

## 7. Chatbot (Gemini)

- API endpoint: `POST /api/chat`
- System prompt: Chuyên viên tư vấn BĐS M-Real Estate
- Flow: Chào → Nhu cầu → Khu vực → Ngân sách → Số PN → Thu SĐT → Lưu lead
- Lead được lưu vào bảng `chatbot_leads` qua Supabase

---

## 8. Admin Dashboard

- Route: `/admin/*`
- Bảo vệ bởi `middleware.ts` (Basic Auth)
- Credentials: `ADMIN_PASSWORD` từ env
- Username: `admin`

---

## 9. Deployment (Future)

- Target: Vercel
- Branch: `main` → production
- Preview: pull requests

---

## 10. Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit

# Add shadcn component
npx shadcn@latest add <component-name>

# Prisma — generate client sau mỗi lần sửa schema
npx prisma generate

# Prisma — push schema lên database (dev)
npx prisma db push

# Prisma — tạo migration
npx prisma migrate dev --name <tên-migration>

# Prisma — mở Prisma Studio (GUI)
npx prisma studio

# Prisma — pull schema từ database hiện tại
npx prisma db pull
```
