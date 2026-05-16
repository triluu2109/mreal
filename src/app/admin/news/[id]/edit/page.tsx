import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { prisma } from "@/server/db/prisma";
import { serializePrisma } from "@/lib/serializers/prisma";
import { NewsForm, type NewsFormInitialData } from "../../NewsForm";
import { requirePagePermission } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("news.manage");
  const { id } = await params;
  const post = await prisma.newsPost.findFirst({ where: { id, deletedAt: null } });
  if (!post) notFound();

  return (
    <div>
      <SectionHeader title="Cập nhật bài viết" backHref="/admin/news" />
      <NewsForm initialData={serializePrisma(post) as NewsFormInitialData} />
    </div>
  );
}
