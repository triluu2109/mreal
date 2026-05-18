/** Map FurnishingStatus enum sang text tiếng Việt public. */
export const FURNISHING_DISPLAY: Record<string, string> = {
  DEVELOPER_HANDOVER: "Hoàn thiện cơ bản",
  BASIC_FURNISHED: "Nội thất cơ bản",
  FULLY_FURNISHED: "Full nội thất",
};

export function formatFurnishing(_note: string | null | undefined, status: string): string {
  return FURNISHING_DISPLAY[status] || status;
}
