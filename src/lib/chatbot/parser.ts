export type NeedType = "rent" | "lease_out" | "buy_sell";

export type LeadProfile = {
  fullName?: string | null;
  phone?: string | null;
  need?: string | null;
  needType?: NeedType | null;
  area?: string | null;
  budget?: string | null;
  bedrooms?: string | null;
  neededTime?: string | null;
  purpose?: string | null;
};

const PHONE_CANDIDATE_REGEX = /(?:\+84|84|0)(?:[\s.-]?\d){8,10}\b/g;

export function normalizeVietnamese(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function detectIntent(text: string): NeedType | null {
  const normalized = normalizeVietnamese(text);

  if (/\b(ky gui|ki gui|gui ban|gui thue|gui can|cho thue lai|can cho thue|can ban)\b/.test(normalized)) {
    return "lease_out";
  }

  if (/\b(can thue|muon thue|thue|rent)\b/.test(normalized)) {
    return "rent";
  }

  if (/\b(can mua|muon mua|mua|buy)\b/.test(normalized)) {
    return "buy_sell";
  }

  return null;
}

export function normalizePhoneVN(text: string) {
  const candidates = text.match(PHONE_CANDIDATE_REGEX) ?? [];

  for (const candidate of candidates) {
    let digits = candidate.replace(/\D/g, "");

    if (digits.startsWith("84")) {
      digits = `0${digits.slice(2)}`;
    }

    if (/^0(?:3|5|7|8|9)\d{8}$/.test(digits)) {
      return digits;
    }
  }

  return null;
}

export function normalizeBudget(text: string) {
  const normalized = normalizeVietnamese(text).replace(/,/g, ".");
  const explicit = normalized.match(/(\d+(?:\.\d+)?)\s*(ty|ti|tỷ|b|trieu|triệu|tr|m)\b/);

  if (explicit) {
    const value = Number(explicit[1]);
    if (!Number.isFinite(value)) return null;

    if (/(ty|ti|tỷ|b)/.test(explicit[2])) {
      return `${formatNumber(value)} tỷ`;
    }

    return `${formatNumber(value)} triệu`;
  }

  const numeric = normalized.match(/\b\d{7,13}\b/);
  if (!numeric) return null;

  const value = Number(numeric[0]);
  if (!Number.isFinite(value)) return null;

  if (value >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000)} tỷ`;
  }

  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000)} triệu`;
  }

  return null;
}

export function normalizeBedrooms(text: string) {
  const normalized = normalizeVietnamese(text);
  const match = normalized.match(/\b([1-5])\s*(pn|phong ngu|phong|br)\b/);
  return match ? `${match[1]}PN` : null;
}

export function getNeedLabel(needType: NeedType) {
  if (needType === "rent") return "Thuê căn hộ Q7 Saigon Riverside";
  if (needType === "lease_out") return "Ký gửi căn hộ Q7 Saigon Riverside";
  return "Mua căn hộ Q7 Saigon Riverside";
}

export function parseLeadText(text: string, currentNeedType?: NeedType | null): LeadProfile {
  const needType = detectIntent(text) ?? currentNeedType ?? null;

  return {
    phone: normalizePhoneVN(text),
    needType,
    need: needType ? getNeedLabel(needType) : null,
    budget: normalizeBudget(text),
    bedrooms: normalizeBedrooms(text),
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}
