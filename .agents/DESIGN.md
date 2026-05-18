# Design System — M-Real Estate

> Hướng dẫn design tokens, components, và visual language cho M-Real Estate.

---

## Brand Identity

**Phong cách**: Corporate Luxury Minimalism

- Chuyên nghiệp, cao cấp, đáng tin
- Nhiều whitespace, grid rõ ràng
- Micro-animations nhẹ nhàng
- Không rối mắt, không quá màu sắc

---

## Color Tokens

Được định nghĩa trong `src/app/globals.css` dưới dạng CSS custom properties:

| CSS Variable | Hex | Mô tả |
|---|---|---|
| `--color-gold` | `#C89B2F` | Primary brand gold |
| `--color-gold-light` | `#E8C55A` | Gold hover state |
| `--color-gold-dark` | `#A07820` | Gold pressed state |
| `--color-navy` | `#1F2A5A` | Primary brand navy |
| `--color-navy-light` | `#2D3D7A` | Navy hover state |
| `--color-navy-dark` | `#141C3D` | Dark navy / footer |
| `--color-white` | `#FFFFFF` | White background |
| `--color-gray-bg` | `#F5F6F8` | Light section bg |
| `--color-gray-text` | `#6B7280` | Muted text |
| `--color-gray-border` | `#E5E7EB` | Borders |

---

## Typography

### Fonts (Google Fonts — loaded in `layout.tsx`)

| Font | Usage | Weight |
|---|---|---|
| **Montserrat** | Headings (H1–H3) | 600, 700, 800 |
| **Inter** | Body, UI text | 400, 500, 600 |

### Scale

| Element | Size | Weight | Line Height |
|---|---|---|---|
| H1 (Hero) | 3.5rem–4.5rem | 800 | 1.1 |
| H2 (Section) | 2rem–2.5rem | 700 | 1.2 |
| H3 (Card title) | 1.25rem | 600 | 1.3 |
| Body | 1rem | 400 | 1.6 |
| Small/Caption | 0.875rem | 400 | 1.5 |

---

## Component Guide

### Button Primary (Gold)
```tsx
<Button className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3 rounded-lg">
  Đặt lịch tư vấn
</Button>
```

### Button Secondary (Navy Outline)
```tsx
<Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
  Tìm hiểu thêm
</Button>
```

### Card
```tsx
<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-border">
  ...
</div>
```

### Input Focus Style
```css
/* Focus ring màu gold */
.focus-gold:focus {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

---

## Section Layout Pattern

Mỗi section trên trang chủ theo pattern:

```tsx
<section className="py-20 bg-[section-bg]">
  <div className="container mx-auto px-4 max-w-7xl">
    {/* Section Header */}
    <div className="text-center mb-12">
      <span className="text-gold font-semibold uppercase tracking-widest text-sm">
        Label nhỏ
      </span>
      <h2 className="text-3xl font-bold text-navy mt-2">
        Tiêu đề section
      </h2>
      <p className="text-gray-text mt-4 max-w-2xl mx-auto">
        Mô tả ngắn
      </p>
    </div>
    {/* Content */}
  </div>
</section>
```

---

## Animation Guidelines (Framer Motion)

### Fade In (scroll-triggered)
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  ...
</motion.div>
```

### Stagger children
```tsx
<motion.div
  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover card effect
```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
  transition={{ duration: 0.2 }}
>
  ...
</motion.div>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Tablet nhỏ |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop nhỏ |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop lớn |

**Mobile-first approach**: Viết styles cho mobile trước, dùng breakpoint prefix để override.

---

## Icon System

Dùng **Lucide React** cho tất cả icons:

```tsx
import { Phone, Mail, MapPin, ChevronRight, Star } from "lucide-react"
```

Size chuẩn: `size={20}` cho inline, `size={24}` cho section icons.
