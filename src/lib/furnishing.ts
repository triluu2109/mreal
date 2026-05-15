/** Map FurnishingStatus enum sang text tiếng Việt. */
export const FURNISHING_DISPLAY: Record<string, string> = {
  DEVELOPER_HANDOVER: "Hoàn thiện cơ bản",
  BASIC_FURNISHED: "Nội thất cơ bản",
  FULLY_FURNISHED: "Full nội thất",
};

export function formatFurnishing(note: string | null | undefined, status: string): string {
  return note?.trim() || FURNISHING_DISPLAY[status] || status;
}
