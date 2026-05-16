# M-Real Estate Content Guidelines

Tài liệu này quy định các tiêu chuẩn về nội dung, văn phong, và cách thức quản lý copywriting cho toàn bộ hệ thống nền tảng số của M-Real Estate.

## 1. Định Vị Thương Hiệu (Brand Voice & Tone)

M-Real Estate định vị là một đơn vị tư vấn và phân phối bất động sản trung và cao cấp. Do đó, văn phong (voice) và giọng điệu (tone) cần phản ánh đúng sự chuyên nghiệp, đẳng cấp và đáng tin cậy.

*   **Chuyên nghiệp & Chuẩn mực:** Sử dụng ngôn từ rõ ràng, rành mạch, đúng ngữ pháp tiếng Việt. Không dùng ngôn ngữ mạng, teencode hoặc các từ ngữ quá bình dân (ví dụ: "chốt sale", "kèo thơm").
*   **Tối giản & Tinh tế (Minimalist & Elegant):** Tránh viết lan man, dài dòng. Đi thẳng vào giá trị thực tế mang lại cho khách hàng. Sử dụng câu ngắn gọn, súc tích.
*   **Khách quan & Minh bạch:** Cung cấp thông tin đa chiều, chính xác về pháp lý và giá trị tài sản. Không sử dụng từ ngữ nói quá, giật tít (clickbait) kiểu "Rẻ nhất thị trường", "Cơ hội có 1-0-2". Thay vào đó, dùng "Mức giá cạnh tranh", "Cơ hội đầu tư tiềm năng".
*   **Tận tâm & Thấu hiểu:** Thể hiện sự sẵn sàng đồng hành cùng khách hàng. Dùng đại từ nhân xưng "Chúng tôi" (đại diện cho M-Real Estate) và "Quý khách / Bạn" (đại diện cho khách hàng).

## 2. Quản Lý Nội Dung Đa Ngôn Ngữ (i18n)

Để đảm bảo khả năng mở rộng sang các ngôn ngữ khác (Tiếng Anh, Tiếng Hàn...) trong tương lai, toàn bộ nội dung tĩnh (static copy) trên website **phải được tách khỏi mã nguồn (code) và quản lý tập trung**.

### 2.1. Cấu trúc thư mục

Tất cả văn bản tĩnh được đặt tại thư mục: `src/locales/`
*   `vi.json`: Dữ liệu tiếng Việt (Ngôn ngữ mặc định hiện tại).
*   `en.json`: (Tương lai) Dữ liệu tiếng Anh.

### 2.2. Quy tắc đặt tên Key trong JSON

*   Sử dụng tiếng Anh cho tất cả các key.
*   Sử dụng `snake_case` hoặc phân cấp đối tượng (nested objects) để tổ chức.
*   Phân chia theo trang (Page) hoặc thành phần (Component).

**Ví dụ cấu trúc tốt:**
```json
{
  "common": {
    "brand": "M-Real Estate",
    "book_appointment": "Đặt lịch tư vấn"
  },
  "home": {
    "hero": {
      "title": "Bất động sản cao cấp",
      "desc": "..."
    }
  }
}
```

### 2.3. Hướng dẫn cho Developer

Khi thêm văn bản mới vào giao diện, **không được hardcode text**.

**SAI:**
```tsx
<button>Gửi yêu cầu ngay</button>
```

**ĐÚNG:**
```tsx
import vi from "@/locales/vi.json";

<button>{vi.common.submit_request}</button>
```

*Lưu ý: Hiện tại đang import trực tiếp `vi.json`. Khi tích hợp thư viện i18n (như `next-intl`), chúng ta sẽ thay thế bằng hook `useTranslations()` hoặc tương tự.*

## 3. Tiêu Chuẩn SEO & Format

*   **Heading:** Tuân thủ cấu trúc phân cấp H1, H2, H3. Mỗi trang chỉ có một H1 duy nhất (thường là tiêu đề chính của trang).
*   **Meta Data:** Mỗi trang phải có Title và Description được cấu hình rõ ràng trong file locale (ví dụ: `vi.about_page.meta`).
*   **Thông tin pháp lý:** Các thông tin như tên công ty ("CÔNG TY TNHH M - REAL ESTATE"), mã số thuế (0318809579), địa chỉ và hotline cần được lấy từ config chung (`src/config/site.ts`) để đảm bảo tính nhất quán tuyệt đối.

## 4. Quy Trình Cập Nhật Nội Dung

1.  Mở file `src/locales/vi.json` (hoặc file ngôn ngữ tương ứng).
2.  Tìm đến key cần sửa và thay đổi nội dung.
3.  Nếu thêm nội dung mới, cần bổ sung key tương ứng vào cấu trúc.
4.  Lưu file và kiểm tra lại trên giao diện (chạy `npm run dev`) để đảm bảo độ dài văn bản không làm vỡ layout (overflow).
