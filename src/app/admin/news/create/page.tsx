import { SectionHeader } from "@/components/admin/SectionHeader";
import { NewsForm } from "../NewsForm";
import { requirePagePermission } from "@/lib/admin/auth";

export default async function CreateNewsPage() {
  await requirePagePermission("news.manage");

  return (
    <div>
      <SectionHeader title="Tạo bài viết mới" backHref="/admin/news" />
      <NewsForm />
    </div>
  );
}
