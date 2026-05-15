# Database Schema — M-Real Estate

> Prisma ORM (v7) với PostgreSQL qua Supabase.
> File: `prisma/schema.prisma` + `prisma.config.ts`

---

## Kiến trúc

```
Next.js Server Code
       │
       ▼ (type-safe queries)
  Prisma Client (generated/)
       │
       ▼ (pg driver adapter)
  Supabase PostgreSQL
       │
       ▼ (RLS vẫn bật)
  Database Tables
```

- **Prisma** xử lý toàn bộ data access từ server code
- **Supabase** cung cấp PostgreSQL host + connection string
- **`DATABASE_URL`** = Direct Connection (không phải pooler) để Prisma migrate/push được
- **`DATABASE_URL_POOLER`** = Transaction Pooler URL dùng khi deploy serverless

---

## `prisma.config.ts`

```typescript
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

---

## `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/client"
}

datasource db {
  provider = "postgresql"
}

// ----------------------------------------------------------------
// Trạng thái lịch hẹn
// ----------------------------------------------------------------
enum AppointmentStatus {
  new
  contacted
  advised
  completed
}

// ----------------------------------------------------------------
// Trạng thái lead chatbot
// ----------------------------------------------------------------
enum LeadStatus {
  new
  contacted
  done
}

// ----------------------------------------------------------------
// Lịch hẹn tư vấn (từ form trang chủ / trang liên hệ)
// ----------------------------------------------------------------
model Appointment {
  id            String            @id @default(uuid()) @db.Uuid
  fullName      String            @map("full_name")
  phone         String
  email         String?
  need          String?           // 'buy' | 'rent' | 'invest' | 'consign'
  area          String?           // Khu vực quan tâm
  budget        String?           // Ngân sách (text: "2-3 tỷ")
  preferredTime String?           @map("preferred_time")
  note          String?
  status        AppointmentStatus @default(new)
  createdAt     DateTime          @default(now()) @map("created_at")

  @@map("appointments")
}

// ----------------------------------------------------------------
// Lead từ chatbot Gemini
// ----------------------------------------------------------------
model ChatbotLead {
  id           String     @id @default(uuid()) @db.Uuid
  phone        String?
  need         String?    // 'buy' | 'rent'
  area         String?
  budget       String?
  bedrooms     String?
  conversation Json?      // Mảng ChatMessage[]
  status       LeadStatus @default(new)
  createdAt    DateTime   @default(now()) @map("created_at")

  @@map("chatbot_leads")
}

// ----------------------------------------------------------------
// Bài viết blog / tin tức
// ----------------------------------------------------------------
model NewsPost {
  id           String    @id @default(uuid()) @db.Uuid
  title        String
  slug         String    @unique
  excerpt      String?
  content      String?
  thumbnailUrl String?   @map("thumbnail_url")
  published    Boolean   @default(false)
  publishedAt  DateTime? @map("published_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@map("news_posts")
}

// ----------------------------------------------------------------
// Form liên hệ
// ----------------------------------------------------------------
model Contact {
  id        String   @id @default(uuid()) @db.Uuid
  fullName  String   @map("full_name")
  phone     String
  email     String?
  message   String?
  createdAt DateTime @default(now()) @map("created_at")

  @@map("contacts")
}
```

---

## Environment Variables (Database)

```env
# Lấy tại Supabase Dashboard → Settings → Database → Connection string
# Dùng "Direct Connection" (port 5432) để Prisma migrate/push
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Dùng "Transaction Pooler" (port 6543) khi deploy serverless
# DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## Setup Commands

```bash
# 1. Cài Prisma
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-pg pg
npm install --save-dev @types/pg

# 2. Init (nếu chưa có prisma/)
npx prisma init --datasource-provider postgresql

# 3. Push schema lên Supabase (dev — không tạo migration file)
npx prisma db push

# 4. Generate client
npx prisma generate

# 5. Xem data trực quan
npx prisma studio
```

---

## Seed Data (News Posts)

Chạy trong Prisma Studio hoặc tạo `prisma/seed.ts`:

```typescript
import { prisma } from '@/lib/prisma'

async function main() {
  await prisma.newsPost.createMany({
    data: [
      {
        title: 'Thị trường bất động sản TP.HCM 2025: Xu hướng và cơ hội',
        slug: 'thi-truong-bds-tphcm-2025',
        excerpt: 'Phân tích chi tiết xu hướng thị trường bất động sản TP.HCM năm 2025.',
        content: '<p>Năm 2025 chứng kiến nhiều biến động tích cực...</p>',
        published: true,
        publishedAt: new Date(),
      },
      {
        title: 'Kinh nghiệm mua nhà lần đầu: 10 điều cần biết',
        slug: 'kinh-nghiem-mua-nha-lan-dau',
        excerpt: 'Hướng dẫn chi tiết cho người mua nhà lần đầu.',
        content: '<p>Mua nhà là quyết định tài chính quan trọng nhất...</p>',
        published: true,
        publishedAt: new Date(),
      },
      {
        title: 'So sánh đầu tư chung cư vs nhà phố tại TP.HCM',
        slug: 'so-sanh-dau-tu-chung-cu-vs-nha-pho',
        excerpt: 'Phân tích ưu nhược điểm của hai loại hình bất động sản.',
        content: '<p>Chung cư và nhà phố đều có những lợi thế riêng biệt...</p>',
        published: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  })
  console.log('Seed completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```
