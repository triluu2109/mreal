import { SectionHeader } from "@/components/admin/SectionHeader";
import { NewsForm } from "../NewsForm";

export default function CreateNewsPage() {
  return (
    <div>
      <SectionHeader title="Tạo bài viết mới" backHref="/admin/news" />
      <NewsForm />
    </div>
  );
}
