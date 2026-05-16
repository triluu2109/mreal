# Content Audit - M-Real Estate

Tài liệu này tổng hợp toàn bộ các nội dung (copywriting) hiện đang được hardcode trên giao diện website để chuẩn bị cho quá trình biên tập lại.

---

## 1. Global Components

### 1.1 Header (`src/components/layout/Header.tsx`)
**Top Bar:**
- Hotline: [Phone]
- [Email]
- [Address]
- Gửi bán & Cho thuê

**Navigation:**
- Trang chủ
- Giới thiệu
  - Dự án
  - Về chúng tôi
- Giỏ hàng
  - Mua bán
  - Cho thuê
- Tin Tức
- Liên Hệ

**Actions:**
- Tìm kiếm bất động sản...
- Gọi: [Phone]

### 1.2 Footer (`src/components/layout/Footer.tsx`)
**CTA Banner:**
- Sẵn sàng tìm kiếm bất động sản lý tưởng?
- Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng tư vấn miễn phí và đồng hành cùng bạn.
- Đặt lịch tư vấn ngay

**Company Intro:**
- M-Real Estate thành lập năm 2018, chuyên kinh doanh bất động sản tại TP.HCM và Bình Dương. Với hơn 7 năm kinh nghiệm, chúng tôi cung cấp dịch vụ mua bán, cho thuê và tư vấn đầu tư bất động sản chuyên nghiệp, uy tín.

**Columns:**
- Giới thiệu: Chính sách bảo mật, Về chúng tôi, Quy định, Liên hệ
- Hỗ trợ: Câu hỏi thường gặp, Hướng dẫn sử dụng, Lợi ích thành viên, Tin tức
- Sản phẩm: Mua bán căn hộ, Cho thuê căn hộ, Dự án Q7 Riverside

**Văn phòng & Bản đồ:**
- Văn phòng chính
- [Address, Phone, Email]
- Xem trên Google Maps
- Copyright © mrealestate.vn. Bảo lưu mọi quyền.
- Thiết kế bởi M-Real Estate Team

---

## 2. Trang chủ (Home Page)

### 2.1 Metadata (`src/app/page.tsx`)
- Title: M-Real Estate
- Description: M-Real Estate — Chuyên mua bán, cho thuê, ký gửi bất động sản tại TP.HCM và Bình Dương. Đội ngũ chuyên nghiệp, uy tín, đồng hành cùng bạn từ năm 2018.

### 2.2 Hero Section (`src/components/sections/HeroSection.tsx`)
*Badge: M-Real Estate*
- **Slide 1:**
  - Bất động sản cao cấp tại TP.HCM & Bình Dương
  - Đức Hưng Group — Đồng hành cùng bạn trên mọi hành trình bất động sản với đội ngũ chuyên nghiệp và tận tâm. *(Lỗi brand name: Đức Hưng Group)*
  - CTAs: Xem giỏ hàng / Liên hệ ngay
- **Slide 2:**
  - Dự án bất động sản Chất lượng – Uy tín – Bền vững
  - Chúng tôi mang đến những dự án đẳng cấp, phù hợp với mọi nhu cầu và khả năng tài chính của khách hàng.
  - CTAs: Xem dự án / Tư vấn miễn phí
- **Slide 3:**
  - Cho thuê bất động sản Đa dạng – Tiện ích – Giá tốt
  - Hàng trăm tin đăng cho thuê căn hộ, nhà phố, văn phòng được cập nhật liên tục theo ngày.
  - CTAs: Xem cho thuê / Đăng tin ngay
- **Slide 4:**
  - Đầu tư sinh lời An toàn – Hiệu quả – Minh bạch
  - Với kinh nghiệm hơn 7 năm trong ngành, chúng tôi tư vấn chiến lược đầu tư BĐS sinh lời bền vững.
  - CTAs: Xem tư vấn / Gặp chuyên gia

### 2.3 About Section (`src/components/sections/AboutSection.tsx`)
*Badge: Ve chung toi* *(Lỗi: Thiếu dấu)*
- GIỚI THIỆU VỀ M-REAL ESTATE
- M-Real Estate thành lập năm 2018, chuyên kinh doanh bất động sản tại TP.Hồ Chí Minh và Bình Dương. Với hơn 7 năm kinh nghiệm trong lĩnh vực bất động sản, chúng tôi đã xây dựng được uy tín vững chắc và sự tin tưởng từ hàng nghìn khách hàng.
- Đội ngũ của chúng tôi gồm các chuyên viên giàu kinh nghiệm, am hiểu thị trường bất động sản TP.HCM và khu vực lân cận, luôn sẵn sàng tư vấn và hỗ trợ khách hàng tìm kiếm bất động sản phù hợp nhất.
- Chúng tôi cung cấp đa dạng các dịch vụ: mua bán, cho thuê, ký gửi bất động sản và tư vấn đầu tư — với cam kết minh bạch, nhanh chóng và hiệu quả.
- **Stats:**
  - 1000+ Giao dich thanh cong *(Lỗi: Thiếu dấu)*
  - 7+ Nam kinh nghiem *(Lỗi: Thiếu dấu)*
  - 98% Khach hang hai long *(Lỗi: Thiếu dấu)*
- CTA: Xem them *(Lỗi: Thiếu dấu)*

### 2.4 Vision Mission Section (`src/components/sections/VisionMissionSection.tsx`)
*Badge: Giá trị của chúng tôi*
- TẦM NHÌN - SỨ MỆNH
- Những giá trị định hướng mọi hoạt động và quyết định của M-Real Estate
- **Sứ mệnh:** Kết nối khách hàng với những bất động sản phù hợp nhất, mang lại giá trị thực và trải nghiệm giao dịch minh bạch, nhanh chóng, an toàn. Chúng tôi đặt lợi ích khách hàng lên hàng đầu trong mọi hoạt động.
- **Tầm nhìn:** Trở thành đơn vị môi giới bất động sản uy tín hàng đầu tại TP.HCM và các tỉnh thành lân cận, được khách hàng tin tưởng và lựa chọn hàng đầu trong các quyết định đầu tư và an cư.
- **Giá trị cốt lõi:** Uy tín — Minh bạch — Tận tâm — Chuyên nghiệp. Bốn giá trị này là kim chỉ nam cho mọi hoạt động của M-Real Estate, từ tư vấn đến hoàn tất giao dịch và chăm sóc sau bán hàng.

---

## 3. Trang Giới thiệu (`src/app/gioi-thieu/page.tsx`)

### 3.1 Metadata
- Title: Về chúng tôi — M-Real Estate
- Description: M-Real Estate thành lập năm 2018, chuyên kinh doanh bất động sản tại TP.HCM và Bình Dương. Hơn 7 năm kinh nghiệm, uy tín, chuyên nghiệp.

### 3.2 Hero
*Badge: Về chúng tôi*
- M-REAL ESTATE Đồng hành cùng bạn từ năm 2018
- Chúng tôi là đơn vị môi giới bất động sản uy tín, chuyên cung cấp dịch vụ mua bán, cho thuê và tư vấn đầu tư tại TP.HCM và Bình Dương.

### 3.3 Stats
- 7+ Năm kinh nghiệm
- 500+ Căn hộ đã giao dịch
- 1000+ Khách hàng tin tưởng
- 98% Khách hàng hài lòng

### 3.4 Giới thiệu công ty
*Label: Câu chuyện của chúng tôi*
- Hơn 7 năm kiến tạo giá trị
- M-Real Estate thành lập năm 2018, xuất phát từ niềm đam mê bất động sản và mong muốn mang đến những giao dịch minh bạch, an toàn cho người mua nhà Việt Nam.
- Với văn phòng chính tại D27 Đường số 5, KDC Sài Gòn Chợ Lớn, Phường Tân Mỹ, TP.HCM — chúng tôi chuyên sâu vào thị trường khu Nam Sài Gòn, đặc biệt là các dự án căn hộ ven sông tại Bình Chánh và Quận 7.
- Đội ngũ của chúng tôi gồm các chuyên viên được đào tạo bài bản, am hiểu pháp lý và thị trường, luôn đặt lợi ích khách hàng lên hàng đầu.

### 3.5 Hành trình phát triển
- 2018: Thành lập M-Real Estate, tập trung thị trường Bình Chánh – TP.HCM
- 2020: Mở rộng sang thị trường Bình Dương và các tỉnh lân cận
- 2022: Đạt 300+ giao dịch thành công, nhận chứng nhận đơn vị uy tín
- 2024: Hợp tác phân phối dự án Q7 Saigon Riverside Complex
- 2025: Ra mắt nền tảng số, phục vụ hơn 1000 khách hàng

### 3.6 Giá trị cốt lõi
*Label: Giá trị cốt lõi*
- Những điều chúng tôi cam kết
- **Uy tín:** Cam kết thông tin minh bạch, pháp lý rõ ràng trong mọi giao dịch.
- **Tận tâm:** Đặt lợi ích khách hàng lên hàng đầu, đồng hành xuyên suốt từng bước.
- **Chuyên nghiệp:** Đội ngũ được đào tạo bài bản, cập nhật thị trường liên tục.
- **Minh bạch:** Công khai chi phí, điều khoản, không phát sinh phí ẩn.

### 3.7 Đội ngũ
*Label: Nhân sự*
- Đội ngũ chuyên nghiệp
- Mỗi thành viên trong đội ngũ chúng tôi đều được đào tạo chuyên sâu và có nhiều năm kinh nghiệm trong lĩnh vực bất động sản.

### 3.8 CTA
- Cần tư vấn bất động sản?
- Liên hệ ngay để được tư vấn miễn phí bởi đội ngũ chuyên viên giàu kinh nghiệm.
- CTAs: Gọi ngay / Liên hệ
