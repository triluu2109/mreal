# M-Real Estate

Website M-Real Estate dùng Next.js App Router, Prisma 7, Supabase PostgreSQL và Supabase Storage.

## Commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm run import:rent -- --dry-run
npm run cleanup:rent-media
```

`npm run cleanup:rent-media` mặc định là dry-run. Thêm `-- --apply` để ghi thay đổi vào DB.

## Listing Data

- Bảng thuê: `rental_listings`.
- Bảng bán: `sale_listings`.
- Media public lưu trong `image_paths` theo đúng thứ tự gallery; phần tử đầu tiên là cover.
- Rental listing có unique key `project_code + unit_code`.
- Listing không còn ảnh hợp lệ phải bị ẩn bằng `is_visible=false`.

## Rental TSV Import

Script `scripts/import-rent-listings.ts` đọc UTF-8 TSV từ:

- `storage/listings/rent/listing-rents.tsv`
- `storage/listings/rent/listing-rents-ghichu.tsv`

Parser đọc ghi chú bằng `parseRentRaw`, dedupe theo `project_code + unit_code`, upload ảnh local trong `storage/listings/rent/{unitCode}` lên Supabase Storage và upsert DB. Chỉ nhận media ảnh: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

## Supabase Storage

Storage path hiện tại:

- Thuê: `listings/rent/{listingId-or-unitCode}/{index}.{ext}`
- Bán: `listings/sell/{listingId-or-unitCode}/{index}.{ext}`
- Dự án: `projects/q7-saigon-riverside/...`
- News: `news/{id}/...`

Admin upload giữ đuôi file ảnh gốc hợp lệ và rename theo index numeric tiếp theo, ví dụ `1.jpg`, `2.png`, `3.webp`. Không lưu `.mp4`, SVG, GIF hoặc file không phải ảnh vào gallery listing.

## Gallery

Trang chi tiết rent/sale render listing data trước, cover image dùng phần tử đầu tiên và được ưu tiên tải. Ảnh phụ được preload nền sau render bằng browser image preload. Thumbnail row nằm dưới ảnh chính, scroll ngang trên mobile, và ẩn khi chỉ có một ảnh.

## Admin Media Manager

Form edit rent/sale hiển thị toàn bộ ảnh hợp lệ từ DB theo thứ tự hiện tại, đánh dấu cover, cho phép xóa ảnh, kéo đổi thứ tự, chọn cover và upload thêm ảnh. Các thao tác media trong edit form cập nhật DB qua server action mà không reload toàn trang.

## Git Workflow

- `main` = production.
- `dev` = development.
- Vercel Production Branch must be `main`.
- `dev` and feature branches are preview/development deployments only.
- Do not develop directly on `main`, except urgent hotfixes.
- Release flow: checkout `main`, merge tested `dev`, run `npm run lint`, `npx tsc --noEmit`, `npm run build`, then push `main`.
