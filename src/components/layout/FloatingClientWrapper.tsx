"use client";

import { usePathname } from "next/navigation";
import FloatingButtons from "./FloatingButtons";

/**
 * Chỉ render FloatingButtons trên các trang public (không phải /admin).
 */
export default function FloatingClientWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <FloatingButtons />;
}
