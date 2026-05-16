import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, FurnishingStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROJECT_CODE = "Q7 Riverside";
const seededSources = ["Minh", "Nghi", "Trang", "Quan"];
const imageExtensions = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const ignoredFolders = new Set(["New folder"]);

type ListingKind = "rent" | "sell";

type ListingSeed = {
  folder: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  furnishingStatus: FurnishingStatus;
  furnishingNote?: string | null;
  view: string;
  availability?: string | null;
  sourceName: string;
};

const rentSeedOverrides: ListingSeed[] = [
  { folder: "rent-001", bedrooms: 1, bathrooms: 1, areaSqm: 45, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Nội khu", availability: "Trống", sourceName: "Minh" },
  { folder: "rent-002", bedrooms: 1, bathrooms: 1, areaSqm: 48, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất cao cấp", view: "Sông", availability: "Trống", sourceName: "Nghi" },
  { folder: "rent-003", bedrooms: 2, bathrooms: 2, areaSqm: 67, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: "Nội thất cơ bản theo chủ đầu tư", view: "Công viên", availability: "Trống từ 01/06", sourceName: "Trang" },
  { folder: "rent-004", bedrooms: 2, bathrooms: 1, areaSqm: 58, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Nội khu", availability: "Trống", sourceName: "Quan" },
  { folder: "rent-005", bedrooms: 2, bathrooms: 2, areaSqm: 72, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Sông và thành phố", availability: "Trống", sourceName: "Minh" },
  { folder: "rent-006", bedrooms: 2, bathrooms: 2, areaSqm: 65, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: "Nội thất cơ bản theo chủ đầu tư", view: "Nội khu", availability: "Trống từ 15/06", sourceName: "Nghi" },
  { folder: "rent-007", bedrooms: 2, bathrooms: 1, areaSqm: 60, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Công viên", availability: "Trống", sourceName: "Trang" },
  { folder: "rent-008", bedrooms: 2, bathrooms: 1, areaSqm: 55, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: null, view: "Nội khu", availability: "Trống", sourceName: "Quan" },
];

const sellSeedOverrides: ListingSeed[] = [
  { folder: "sell-001", bedrooms: 1, bathrooms: 1, areaSqm: 45, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: null, view: "Nội khu", availability: null, sourceName: "Minh" },
  { folder: "sell-002", bedrooms: 1, bathrooms: 1, areaSqm: 48, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Sông", availability: null, sourceName: "Nghi" },
  { folder: "sell-003", bedrooms: 2, bathrooms: 2, areaSqm: 70, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: "Nội thất cơ bản theo chủ đầu tư", view: "Công viên", availability: "Đang ở", sourceName: "Trang" },
  { folder: "sell-004", bedrooms: 2, bathrooms: 1, areaSqm: 58, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: null, view: "Nội khu", availability: null, sourceName: "Quan" },
  { folder: "sell-005", bedrooms: 2, bathrooms: 2, areaSqm: 72, furnishingStatus: FurnishingStatus.FULLY_FURNISHED, furnishingNote: "Full nội thất", view: "Sông và thành phố", availability: null, sourceName: "Minh" },
  { folder: "sell-006", bedrooms: 3, bathrooms: 2, areaSqm: 86, furnishingStatus: FurnishingStatus.DEVELOPER_HANDOVER, furnishingNote: "Nội thất cơ bản theo chủ đầu tư", view: "Sông", availability: "Đang ở", sourceName: "Nghi" },
];

const newsPosts = [
  {
    title: "Q7 Saigon Riverside Complex: vì sao căn hộ Quận 7 vẫn hút khách thuê?",
    slug: "q7-saigon-riverside-complex-hut-khach-thue-quan-7",
    excerpt: "Phân tích nhu cầu thuê căn hộ tại Q7 Saigon Riverside Complex, lợi thế vị trí Quận 7 và các yếu tố giúp dự án duy trì sức hút tại khu Nam Sài Gòn.",
    thumbnailPath: "projects/q7-saigon-riverside/hero-section/010_tt_duan.webp",
    publishedAt: new Date("2026-05-01T09:00:00+07:00"),
    content: `# Q7 Saigon Riverside Complex: vì sao căn hộ Quận 7 vẫn hút khách thuê?

Q7 Saigon Riverside Complex là một trong những dự án căn hộ được nhắc đến nhiều tại trục Đào Trí, Quận 7. Với nhóm khách thuê làm việc tại khu Nam Sài Gòn, Phú Mỹ Hưng, Quận 1 hoặc Thủ Thiêm, dự án có lợi thế rõ ở khả năng kết nối và mức giá thuê còn dễ tiếp cận hơn nhiều khu căn hộ hạng sang lân cận.

![Toàn cảnh Q7 Saigon Riverside Complex](projects/q7-saigon-riverside/hero-section/010_tt_duan.webp)

## Lợi thế vị trí cho nhu cầu thuê thật

Từ Q7 Saigon Riverside Complex, cư dân có thể di chuyển về Phú Mỹ Hưng, Crescent Mall, cầu Phú Mỹ, đường Nguyễn Văn Linh và khu trung tâm qua các trục chính của Quận 7. Đây là lợi thế quan trọng với khách thuê cần cân bằng giữa chi phí, thời gian đi làm và tiện ích sống hằng ngày.

## Loại căn hộ được tìm nhiều

Các căn 1 phòng ngủ phù hợp với người độc thân hoặc cặp đôi trẻ. Căn 2 phòng ngủ là nhóm có nhu cầu rộng hơn, đặc biệt với gia đình nhỏ hoặc khách thuê cần thêm phòng làm việc. Những căn full nội thất, view sông hoặc view nội khu thường có tốc độ chốt thuê tốt hơn nếu giá hợp lý.

## Kinh nghiệm chọn căn thuê

- Ưu tiên căn có nội thất rõ ràng, hình ảnh thật và tình trạng bàn giao cụ thể.
- Kiểm tra phí quản lý, phí gửi xe, thời hạn hợp đồng và điều kiện đặt cọc.
- Với căn giá tốt, nên đặt lịch xem sớm vì nguồn cung thay đổi nhanh.

## Kết luận

Nếu bạn đang tìm căn hộ cho thuê tại Quận 7, Q7 Saigon Riverside Complex là lựa chọn đáng cân nhắc nhờ vị trí, tiện ích và mặt bằng giá thuê cạnh tranh. M-Real Estate thường xuyên cập nhật giỏ hàng thuê mới để khách dễ so sánh theo layout, giá và tình trạng nội thất.`,
  },
  {
    title: "Mua bán căn hộ Q7 Saigon Riverside Complex: những điểm cần kiểm tra trước khi xuống tiền",
    slug: "mua-ban-can-ho-q7-saigon-riverside-complex-can-kiem-tra",
    excerpt: "Checklist thực tế cho khách mua căn hộ Q7 Saigon Riverside Complex: pháp lý, giá bán, hợp đồng, view, nội thất và khả năng khai thác cho thuê.",
    thumbnailPath: "projects/q7-saigon-riverside/hinh-anh-du-an/anh-chup-thuc-te-du-an-bang-flycam.webp",
    publishedAt: new Date("2026-05-03T10:00:00+07:00"),
    content: `# Mua bán căn hộ Q7 Saigon Riverside Complex: những điểm cần kiểm tra trước khi xuống tiền

Mua căn hộ tại Q7 Saigon Riverside Complex không chỉ là câu chuyện giá bán. Người mua cần kiểm tra kỹ pháp lý, hiện trạng căn hộ, giá hợp đồng, chi phí sang nhượng và khả năng khai thác cho thuê sau khi nhận nhà.

![Hình ảnh thực tế dự án Q7 Saigon Riverside Complex](projects/q7-saigon-riverside/hinh-anh-du-an/anh-chup-thuc-te-du-an-bang-flycam.webp)

## 1. Kiểm tra pháp lý và tình trạng hợp đồng

Trước khi đặt cọc, cần xác định căn hộ đang ở giai đoạn nào: hợp đồng mua bán, đã thanh toán bao nhiêu, có đang vay ngân hàng hay có ràng buộc chuyển nhượng nào không. Những thông tin này ảnh hưởng trực tiếp đến thời gian giao dịch và chi phí thực tế.

## 2. So sánh giá bán theo layout và view

Không nên chỉ nhìn tổng giá. Hãy quy đổi về giá trên mỗi mét vuông, so sánh giữa căn 1PN, 2PN, 3PN, tầng cao, view sông, view nội khu và tình trạng nội thất. Một căn giá cao hơn nhưng view tốt, nội thất đầy đủ và dễ cho thuê có thể hiệu quả hơn trong dài hạn.

## 3. Dự tính dòng tiền cho thuê

Nếu mục tiêu là đầu tư, cần ước tính giá thuê thực tế, tỷ lệ trống phòng, chi phí bảo trì và thời gian hoàn vốn. Q7 Saigon Riverside Complex có lợi thế nhờ nhu cầu thuê tại Quận 7, nhưng hiệu quả vẫn phụ thuộc vào giá mua đầu vào.

## Kết luận

Một giao dịch tốt cần đủ ba yếu tố: pháp lý rõ, giá hợp lý và căn hộ phù hợp nhu cầu sử dụng hoặc khai thác. M-Real Estate hỗ trợ lọc giỏ hàng bán theo mã căn, giá, nội thất và tình trạng để khách mua ra quyết định nhanh hơn.`,
  },
  {
    title: "Khu Nam Sài Gòn và tiềm năng căn hộ Quận 7 trong năm 2026",
    slug: "khu-nam-sai-gon-tiem-nang-can-ho-quan-7-2026",
    excerpt: "Góc nhìn thị trường về căn hộ Quận 7, hạ tầng khu Nam Sài Gòn và vai trò của các dự án như Q7 Saigon Riverside Complex.",
    thumbnailPath: "projects/q7-saigon-riverside/hinh-anh-du-an/360_hung-thinh-61bd45eff1a8b635.webp",
    publishedAt: new Date("2026-05-06T09:30:00+07:00"),
    content: `# Khu Nam Sài Gòn và tiềm năng căn hộ Quận 7 trong năm 2026

Khu Nam Sài Gòn tiếp tục là thị trường căn hộ có nhu cầu ở thật ổn định nhờ hệ sinh thái tiện ích, trường học, trung tâm thương mại và cộng đồng cư dân đã hình thành. Trong bối cảnh người mua thận trọng hơn, các dự án có vị trí rõ ràng và mức giá hợp lý như Q7 Saigon Riverside Complex có lợi thế cạnh tranh.

![Không gian dự án tại Quận 7](projects/q7-saigon-riverside/hinh-anh-du-an/360_hung-thinh-61bd45eff1a8b635.webp)

## Nhu cầu ở thật vẫn là nền tảng

Quận 7 thu hút nhóm khách hàng cần môi trường sống đầy đủ tiện ích nhưng vẫn kết nối được về trung tâm. Đây là lý do căn hộ vừa túi tiền, có thể ở ngay hoặc cho thuê nhanh, thường giữ thanh khoản tốt hơn trong giai đoạn thị trường chọn lọc.

## Hạ tầng tạo biên độ tăng giá

Các trục Nguyễn Văn Linh, Huỳnh Tấn Phát, Nguyễn Lương Bằng và kết nối về Nhà Bè, Quận 8, Thủ Thiêm giúp khu Nam Sài Gòn duy trì vai trò cửa ngõ phía Nam TP.HCM. Khi hạ tầng được cải thiện, căn hộ có vị trí thuận tiện sẽ hưởng lợi trước.

## Nhà đầu tư nên ưu tiên gì?

- Chọn căn có pháp lý minh bạch và giá mua hợp lý.
- Ưu tiên layout dễ thuê như 1PN, 2PN.
- Kiểm tra chất lượng nội thất, view và phí vận hành.

## Kết luận

Tiềm năng căn hộ Quận 7 đến từ nhu cầu ở thật và khả năng khai thác cho thuê. Với khách mua để ở hoặc đầu tư trung hạn, Q7 Saigon Riverside Complex là dự án nên được đưa vào danh sách so sánh.`,
  },
  {
    title: "Thuê căn hộ full nội thất hay căn trống tại Q7 Saigon Riverside Complex?",
    slug: "thue-can-ho-full-noi-that-hay-can-trong-q7-saigon-riverside",
    excerpt: "So sánh căn full nội thất, nội thất cơ bản và căn hoàn thiện cơ bản để người thuê chọn đúng ngân sách và nhu cầu tại Q7 Saigon Riverside Complex.",
    thumbnailPath: "listings/rent/rent-001/cover.webp",
    publishedAt: new Date("2026-05-09T08:30:00+07:00"),
    content: `# Thuê căn hộ full nội thất hay căn trống tại Q7 Saigon Riverside Complex?

Khi tìm thuê căn hộ Q7 Saigon Riverside Complex, tình trạng nội thất là yếu tố ảnh hưởng lớn đến chi phí ban đầu, tiền thuê hằng tháng và sự tiện lợi khi dọn vào ở. Người thuê nên hiểu rõ khác biệt giữa căn full nội thất, nội thất cơ bản và căn hoàn thiện cơ bản.

![Căn hộ cho thuê full nội thất](listings/rent/rent-001/cover.webp)

## Căn full nội thất

Căn full nội thất phù hợp với khách muốn vào ở ngay, không muốn tốn thêm chi phí mua sắm. Nhóm căn này thường có giá thuê cao hơn, nhưng tiết kiệm thời gian và phù hợp với hợp đồng từ 12 tháng trở lên.

## Căn nội thất cơ bản

Căn nội thất cơ bản thường có một số hạng mục thiết yếu như bếp, rèm, máy lạnh hoặc tủ. Đây là lựa chọn cân bằng cho khách đã có đồ cá nhân và muốn tối ưu chi phí thuê.

## Căn hoàn thiện cơ bản

Căn hoàn thiện cơ bản phù hợp với khách thuê dài hạn muốn tự setup không gian sống. Tuy nhiên, cần tính thêm chi phí nội thất ban đầu và thời gian lắp đặt.

## Gợi ý chọn nhanh

- Ở ngay, ít đồ cá nhân: chọn full nội thất.
- Muốn tiết kiệm nhưng vẫn tiện: chọn nội thất cơ bản.
- Thuê dài hạn và thích tự thiết kế: cân nhắc căn hoàn thiện cơ bản.

M-Real Estate đã bổ sung bộ lọc theo tình trạng nội thất để khách thuê dễ tìm đúng căn phù hợp ngân sách và thời điểm dọn vào.`,
  },
];

function formatRentDisplay(priceVnd: number): string {
  const millions = priceVnd / 1_000_000;
  return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} triệu/tháng`;
}

function formatSaleDisplay(priceVnd: number): string {
  const ty = priceVnd / 1_000_000_000;
  return `${ty % 1 === 0 ? ty.toFixed(0) : ty.toFixed(3).replace(/\.?0+$/, "").replace(".", ",")} tỷ`;
}

function discoverListingSeeds(kind: ListingKind, overrides: ListingSeed[]): ListingSeed[] {
  const overrideMap = new Map(overrides.map((seed) => [seed.folder, seed]));
  const folderPath = path.join(process.cwd(), "storage", "listings", kind);
  const discovered = fs.existsSync(folderPath)
    ? fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !ignoredFolders.has(entry.name))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    : [];

  const folders = Array.from(new Set([...overrides.map((seed) => seed.folder), ...discovered]));

  return folders.map((folder, index) => overrideMap.get(folder) ?? buildDefaultSeed(folder, kind, index));
}

function buildDefaultSeed(folder: string, kind: ListingKind, index: number): ListingSeed {
  const bedrooms = inferBedrooms(folder, index);
  const bathrooms = bedrooms >= 2 ? (index % 3 === 0 ? 1 : 2) : 1;
  const baseArea = bedrooms === 1 ? 45 : bedrooms === 2 ? 65 : 86;
  const areaSqm = baseArea + ((index % 5) - 2) * 2;
  const fullFurnished = kind === "rent" || index % 3 === 0;

  return {
    folder,
    bedrooms,
    bathrooms,
    areaSqm,
    furnishingStatus: fullFurnished ? FurnishingStatus.FULLY_FURNISHED : FurnishingStatus.DEVELOPER_HANDOVER,
    furnishingNote: fullFurnished ? "Full nội thất" : "Nội thất cơ bản theo chủ đầu tư",
    view: ["Nội khu", "Sông", "Công viên", "Thành phố"][index % 4],
    availability: kind === "rent" ? "Trống" : index % 2 === 0 ? null : "Đang ở",
    sourceName: seededSources[index % seededSources.length],
  };
}

function inferBedrooms(folder: string, index: number): number {
  const normalized = folder.toLowerCase();
  if (normalized.startsWith("u") || normalized.includes("3pn")) return 3;
  if (normalized.startsWith("v") || normalized.startsWith("s2") || normalized.includes("2pn")) return 2;
  if (normalized.startsWith("m1") || normalized.startsWith("s1") || normalized.includes("1pn")) return 1;
  return index % 6 === 0 ? 3 : index % 3 === 0 ? 1 : 2;
}

function readImagePaths(kind: ListingKind, folder: string): string[] {
  const storagePath = path.join(process.cwd(), "storage", "listings", kind, folder);
  const legacyPath = path.join(process.cwd(), "public", "images", "listings", kind, folder);
  const folderPath = fs.existsSync(storagePath) ? storagePath : legacyPath;

  if (!fs.existsSync(folderPath)) return [];

  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `listings/${kind}/${folder}/${entry.name}`)
    .sort(sortListingImages);
}

function sortListingImages(a: string, b: string) {
  return listingImageOrder(a) - listingImageOrder(b) || a.localeCompare(b, "en", { numeric: true });
}

function listingImageOrder(imagePath: string) {
  const name = path.basename(imagePath, path.extname(imagePath)).toLowerCase();
  if (name === "cover") return 0;
  const index = Number(name);
  return Number.isFinite(index) ? index : Number.MAX_SAFE_INTEGER;
}

async function main() {
  console.log("Seeding data...");

  const rentSeeds = discoverListingSeeds("rent", rentSeedOverrides);
  const sellSeeds = discoverListingSeeds("sell", sellSeedOverrides);

  await prisma.rentalListing.deleteMany({
    where: {
      OR: [
        { unitCode: { startsWith: "RENT-" } },
        { projectCode: PROJECT_CODE, sourceName: { in: seededSources } },
      ],
    },
  });
  await prisma.saleListing.deleteMany({
    where: {
      OR: [
        { unitCode: { startsWith: "SELL-" } },
        { projectCode: PROJECT_CODE, sourceName: { in: seededSources } },
      ],
    },
  });

  let rentCount = 0;
  for (const [index, seed] of rentSeeds.entries()) {
    const imagePaths = readImagePaths("rent", seed.folder);
    if (imagePaths.length < 2) {
      console.log(`  Skipping rent ${seed.folder} - not enough images (${imagePaths.length})`);
      continue;
    }

    const rentPrice = seed.bedrooms === 1
      ? 9_000_000 + index * 500_000
      : seed.bedrooms === 2
        ? 13_000_000 + index * 700_000
        : 22_000_000 + index * 1_000_000;

    await prisma.rentalListing.create({
      data: {
        projectCode: PROJECT_CODE,
        unitCode: `RENT-${String(index + 1).padStart(3, "0")}`,
        areaSqm: seed.areaSqm,
        bedrooms: seed.bedrooms,
        bathrooms: seed.bathrooms,
        furnishingStatus: seed.furnishingStatus,
        furnishingNote: seed.furnishingNote ?? null,
        view: seed.view,
        rentPrice,
        displayPrice: formatRentDisplay(rentPrice),
        availability: seed.availability ?? null,
        sourceName: seed.sourceName,
        note: `Seeded cart listing from ${seed.folder} | Public title hides unit code`,
        imagePaths,
        isVisible: true,
        isFeatured: index < 2,
      },
    });
    rentCount += 1;
  }

  let sellCount = 0;
  for (const [index, seed] of sellSeeds.entries()) {
    const imagePaths = readImagePaths("sell", seed.folder);
    if (imagePaths.length < 2) {
      console.log(`  Skipping sell ${seed.folder} - not enough images (${imagePaths.length})`);
      continue;
    }

    const sellingPriceTy = seed.bedrooms === 1
      ? 2.25 + index * 0.08
      : seed.bedrooms === 2
        ? 3.85 + index * 0.12
        : 5.45 + index * 0.12;
    const sellingPrice = Math.round(sellingPriceTy * 1_000_000_000);
    const contractPrice = sellingPrice - (seed.bedrooms === 1 ? 1_100_000_000 : seed.bedrooms === 2 ? 1_800_000_000 : 2_500_000_000);

    await prisma.saleListing.create({
      data: {
        projectCode: PROJECT_CODE,
        unitCode: `SELL-${String(index + 1).padStart(3, "0")}`,
        areaSqm: seed.areaSqm,
        bedrooms: seed.bedrooms,
        bathrooms: seed.bathrooms,
        furnishingStatus: seed.furnishingStatus,
        furnishingNote: seed.furnishingNote ?? null,
        view: seed.view,
        contractPrice: contractPrice > 0 ? contractPrice : null,
        sellingPrice,
        displayPrice: formatSaleDisplay(sellingPrice),
        availability: seed.availability ?? null,
        sourceName: seed.sourceName,
        note: `Seeded cart listing from ${seed.folder} | Public title hides unit code`,
        imagePaths,
        isVisible: true,
        isFeatured: index < 2,
      },
    });
    sellCount += 1;
  }

  const staffData = [
    { name: "Nguyễn Minh Khoa", role: "Giám đốc Kinh doanh", phone: "0901111222", initials: "MK", color: "from-navy to-navy-light", speciality: "Căn hộ Q7 Saigon Riverside", order: 1 },
    { name: "Trần Lan Anh", role: "Chuyên viên Tư vấn Cao cấp", phone: "0901333444", initials: "LA", color: "from-gold-dark to-gold", speciality: "Mua bán căn hộ", order: 2 },
    { name: "Lê Văn Đức", role: "Chuyên viên Đầu tư", phone: "0901555666", initials: "VD", color: "from-navy-light to-navy", speciality: "Ký gửi BĐS", order: 3 },
    { name: "Phạm Thu Hương", role: "Chuyên viên Tư vấn", phone: "0901777888", initials: "TH", color: "from-gold to-gold-light", speciality: "Cho thuê căn hộ", order: 4 },
  ];

  if ((await prisma.staff.count()) === 0) {
    for (const staff of staffData) {
      await prisma.staff.create({ data: staff });
    }
  }

  for (const post of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        thumbnailPath: post.thumbnailPath,
        imagePaths: [post.thumbnailPath],
        published: true,
        publishedAt: post.publishedAt,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        thumbnailPath: post.thumbnailPath,
        imagePaths: [post.thumbnailPath],
        published: true,
        publishedAt: post.publishedAt,
      },
    });
  }

  console.log(`Seed completed: ${sellCount} sale + ${rentCount} rental + staff + ${newsPosts.length} news posts`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
