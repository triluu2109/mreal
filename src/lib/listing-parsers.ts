export type ParsedRent = {
  projectCode?: string;
  unitCode?: string;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  view?: string;
  price?: number;
  availability?: string;
  sourceName?: string;
  note?: string;
};

export type ParsedSell = {
  projectCode?: string;
  unitCode?: string;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  view?: string;
  contractPrice?: string;
  sellingPrice?: string;
  availability?: string;
  sourceName?: string;
  note?: string;
};

export function parseRentRaw(rawText: string): ParsedRent {
  const { body, note } = splitNote(rawText);
  const common = parseHeaderAndCommon(body);
  const parts = common.parts;
  const pricePart = parts.find((part) => normalized(part).startsWith("gia "));
  const sourcePart = parts.find((part) => normalized(part).startsWith("nguon "));
  const viewPart = parts.find((part) => normalized(part).startsWith("view "));
  const availabilityPart = parts.find((part) => {
    const text = normalized(part);
    if (part === pricePart || part === sourcePart || part === viewPart) return false;
    if (isArea(part) || isLayout(part)) return false;
    return /^(trong|co san|dang trong|tu ngay|\d{1,2}[/-]\d{1,2})/.test(text);
  });

  const furnishing = parts.find((part) => {
    if ([pricePart, sourcePart, viewPart, availabilityPart].includes(part)) return false;
    return !isArea(part) && !isLayout(part);
  });

  return {
    ...common.base,
    furnishing,
    view: removePrefix(viewPart, "view"),
    price: parseFirstNumber(pricePart),
    availability: availabilityPart,
    sourceName: removePrefix(sourcePart, "nguon"),
    note,
  };
}

export function parseSellRaw(rawText: string): ParsedSell {
  const { body, note } = splitNote(rawText);
  const common = parseHeaderAndCommon(body);
  const parts = common.parts;
  const contractPart = parts.find((part) => normalized(part).startsWith("gia hd "));
  const sellingPart = parts.find((part) => normalized(part).startsWith("gia ban "));
  const sourcePart = parts.find((part) => normalized(part).startsWith("nguon "));
  const viewPart = parts.find((part) => normalized(part).startsWith("view "));
  const availabilityPart = parts.find((part) => /^(trong|dang trong|co san|da coc|dang o|hen)/.test(normalized(part)));
  const known = new Set([contractPart, sellingPart, sourcePart, viewPart, availabilityPart].filter(Boolean));

  const furnishing = parts.find((part) => {
    const text = normalized(part);
    if (known.has(part) || isArea(part) || isLayout(part)) return false;
    if (/^(cua|bc|ban cong)\s+/.test(text)) return false;
    return /nt|noi that/.test(text) || !/^(gia|nguon|view)\s+/.test(text);
  });

  return {
    ...common.base,
    furnishing,
    view: removePrefix(viewPart, "view"),
    contractPrice: removePrefix(contractPart, "gia hd"),
    sellingPrice: removePrefix(sellingPart, "gia ban"),
    availability: availabilityPart,
    sourceName: removePrefix(sourcePart, "nguon"),
    note,
  };
}

function splitNote(rawText: string) {
  const match = rawText.match(/#note\s*:/i);
  if (!match || match.index == null) return { body: rawText.trim(), note: undefined };

  return {
    body: rawText.slice(0, match.index).trim(),
    note: rawText.slice(match.index + match[0].length).trim() || undefined,
  };
}

function parseHeaderAndCommon(body: string) {
  const projectCode = body.match(/\u3010([^\u3011]+)\u3011/)?.[1]?.trim();
  const withoutProject = body.replace(/\u3010[^\u3011]+\u3011/, "").trim();
  const [unitAndArea = "", ...rest] = withoutProject.split(",");
  const [unitCodeRaw = "", areaRaw = ""] = unitAndArea.split(/\s+-\s+/);
  const parts = [areaRaw, ...rest].map((part) => part.trim()).filter(Boolean);
  const areaPart = parts.find(isArea);
  const layoutPart = parts.find(isLayout);
  const layout = layoutPart?.match(/(\d+)\s*PN\s*(\d*)/i);

  return {
    base: {
      projectCode,
      unitCode: unitCodeRaw.trim() || undefined,
      areaSqm: parseFirstNumber(areaPart),
      bedrooms: layout?.[1] ? Number(layout[1]) : undefined,
      bathrooms: layout?.[2] ? Number(layout[2]) : undefined,
    },
    parts,
  };
}

function normalized(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function removePrefix(text: string | undefined, prefix: string) {
  if (!text) return undefined;
  const source = normalized(text);
  if (!source.startsWith(prefix)) return text.trim();
  return text.slice(prefix.length).trim();
}

function isArea(part: string) {
  return /\d+(?:[.,]\d+)?\s*m2/i.test(part);
}

function isLayout(part: string) {
  return /\d+\s*PN\s*\d*/i.test(part);
}

function parseFirstNumber(text?: string) {
  const match = text?.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(",", ".")) : undefined;
}
