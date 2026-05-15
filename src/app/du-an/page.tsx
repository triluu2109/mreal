import { redirect } from "next/navigation";

// Hiện tại chỉ có 1 dự án — redirect thẳng đến trang chi tiết
// Khi có thêm dự án, thay bằng trang danh sách
export default function DuAnPage() {
  redirect("/du-an/q7-saigon-riverside-complex");
}
