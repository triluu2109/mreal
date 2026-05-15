import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const seededSources = ["Minh", "Nghi", "Trang", "Quan"];
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

type ListingSeed = {
  folder: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  furnishing: string;
  view: string;
  availability?: string | null;
  sourceName: string;
};

const rentSeeds: ListingSeed[] = [
  { folder: "rent-001", bedrooms: 1, bathrooms: 1, areaSqm: 45, furnishing: "FULL NT", view: "Noi khu", availability: "trong", sourceName: "Minh" },
  { folder: "rent-002", bedrooms: 1, bathrooms: 1, areaSqm: 48, furnishing: "FULL NT cao cap", view: "Song", availability: "trong", sourceName: "Nghi" },
  { folder: "rent-003", bedrooms: 2, bathrooms: 2, areaSqm: 67, furnishing: "NTCB", view: "Cong vien", availability: "trong tu 01/06", sourceName: "Trang" },
  { folder: "rent-004", bedrooms: 2, bathrooms: 1, areaSqm: 58, furnishing: "FULL NT", view: "Noi khu", availability: "trong", sourceName: "Quan" },
  { folder: "rent-005", bedrooms: 2, bathrooms: 2, areaSqm: 72, furnishing: "FULL NT", view: "Song va thanh pho", availability: "trong", sourceName: "Minh" },
  { folder: "rent-006", bedrooms: 2, bathrooms: 2, areaSqm: 65, furnishing: "NTCB", view: "Noi khu", availability: "trong tu 15/06", sourceName: "Nghi" },
  { folder: "rent-007", bedrooms: 2, bathrooms: 1, areaSqm: 60, furnishing: "FULL NT", view: "Cong vien", availability: "trong", sourceName: "Trang" },
  { folder: "rent-008", bedrooms: 2, bathrooms: 1, areaSqm: 55, furnishing: "NTCB", view: "Noi khu", availability: "trong", sourceName: "Quan" },
];

const sellSeeds: ListingSeed[] = [
  { folder: "sell-001", bedrooms: 1, bathrooms: 1, areaSqm: 45, furnishing: "Nha trong", view: "Noi khu", availability: null, sourceName: "Minh" },
  { folder: "sell-002", bedrooms: 1, bathrooms: 1, areaSqm: 48, furnishing: "FULL NT", view: "Song", availability: null, sourceName: "Nghi" },
  { folder: "sell-003", bedrooms: 2, bathrooms: 2, areaSqm: 70, furnishing: "NTCB", view: "Cong vien", availability: "dang o", sourceName: "Trang" },
  { folder: "sell-004", bedrooms: 2, bathrooms: 1, areaSqm: 58, furnishing: "Nha trong", view: "Noi khu", availability: null, sourceName: "Quan" },
  { folder: "sell-005", bedrooms: 2, bathrooms: 2, areaSqm: 72, furnishing: "FULL NT", view: "Song va thanh pho", availability: null, sourceName: "Minh" },
  { folder: "sell-006", bedrooms: 3, bathrooms: 2, areaSqm: 86, furnishing: "NTCB", view: "Song", availability: "dang o", sourceName: "Nghi" },
];

function readImageUrls(kind: "rent" | "sell", folder: string) {
  const folderPath = path.join(process.cwd(), "public", "cart", kind, folder);
  if (!fs.existsSync(folderPath)) return [];

  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `/cart/${kind}/${folder}/${entry.name}`)
    .sort();
}

async function main() {
  console.log("Seeding data...");

  await prisma.rent.deleteMany({
    where: {
      OR: [
        { unitCode: { startsWith: "RENT-" } },
        { projectCode: "Q7RVS", sourceName: { in: seededSources } },
      ],
    },
  });
  await prisma.sell.deleteMany({
    where: {
      OR: [
        { unitCode: { startsWith: "SELL-" } },
        { projectCode: "Q7RVS", sourceName: { in: seededSources } },
      ],
    },
  });

  let rentCount = 0;
  for (const [index, seed] of rentSeeds.entries()) {
    const imageUrls = readImageUrls("rent", seed.folder);
    if (imageUrls.length < 2) continue;

    await prisma.rent.create({
      data: {
        projectCode: "Q7 Riverside",
        unitCode: `RENT-${String(index + 1).padStart(3, "0")}`,
        areaSqm: seed.areaSqm,
        bedrooms: seed.bedrooms,
        bathrooms: seed.bathrooms,
        furnishing: seed.furnishing,
        view: seed.view,
        price: seed.bedrooms === 1 ? 9 + index : seed.bedrooms === 2 ? 13 + index * 0.7 : 22 + index,
        availability: seed.availability,
        sourceName: seed.sourceName,
        note: "Seeded cart listing | Public title hides unit code",
        imageUrls,
        isVisible: true,
      },
    });
    rentCount += 1;
  }

  let sellCount = 0;
  for (const [index, seed] of sellSeeds.entries()) {
    const imageUrls = readImageUrls("sell", seed.folder);
    if (imageUrls.length < 2) continue;

    const basePrice = seed.bedrooms === 1 ? 2.25 + index * 0.08 : seed.bedrooms === 2 ? 3.85 + index * 0.12 : 5.45 + index * 0.12;

    await prisma.sell.create({
      data: {
        projectCode: "Q7 Riverside",
        unitCode: `SELL-${String(index + 1).padStart(3, "0")}`,
        areaSqm: seed.areaSqm,
        bedrooms: seed.bedrooms,
        bathrooms: seed.bathrooms,
        furnishing: seed.furnishing,
        view: seed.view,
        contractPrice: seed.bedrooms === 1 ? (basePrice - 1.1).toFixed(3) : (basePrice - 1.8).toFixed(3),
        sellingPrice: `${basePrice.toFixed(3)} ty`,
        availability: seed.availability,
        sourceName: seed.sourceName,
        note: "Seeded cart listing | Public title hides unit code",
        imageUrls,
        isVisible: true,
      },
    });
    sellCount += 1;
  }

  const staffData = [
    { name: "Nguyen Minh Khoa", role: "Giam doc Kinh doanh", phone: "0901111222", initials: "MK", color: "from-navy to-navy-light", speciality: "Can ho Q7 Saigon Riverside", order: 1 },
    { name: "Tran Lan Anh", role: "Chuyen vien Tu van Cap cao", phone: "0901333444", initials: "LA", color: "from-gold-dark to-gold", speciality: "Mua ban can ho", order: 2 },
    { name: "Le Van Duc", role: "Chuyen vien Dau tu", phone: "0901555666", initials: "VD", color: "from-navy-light to-navy", speciality: "Ky gui BDS", order: 3 },
    { name: "Pham Thu Huong", role: "Chuyen vien Tu van", phone: "0901777888", initials: "TH", color: "from-gold to-gold-light", speciality: "Cho thue can ho", order: 4 },
  ];

  if ((await prisma.staff.count()) === 0) {
    for (const staff of staffData) {
      await prisma.staff.create({ data: staff });
    }
  }

  console.log(`Seed completed: ${sellCount} sell + ${rentCount} rent + staff`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
