"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "./ChatbotWidget";

/**
 * Chỉ render ChatbotWidget trên các trang public (không phải /admin).
 */
export default function ChatbotClientWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <ChatbotWidget />;
}
