import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { prisma } from "@/server/db/prisma";
import { serializePrisma } from "@/lib/serializers/prisma";
import { NewsForm, type NewsFormInitialData } from "../../NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <SectionHeader title="Cập nhật bài viết" backHref="/admin/news" />
      <NewsForm initialData={serializePrisma(post) as NewsFormInitialData} />
    </div>
  );
}
