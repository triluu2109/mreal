export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function makeListingSlug(title: string, id = crypto.randomUUID()): string {
  return `${slugify(title)}-${id.slice(0, 8)}`;
}

export function formatArea(areaSqm: number | null | undefined): string | null {
  if (areaSqm == null) return null;
  const value = Number(areaSqm);
  return `${Number.isInteger(value) ? value.toFixed(0) : value} m²`;
}

export function formatLayout(bedrooms?: number | null, bathrooms?: number | null): string | null {
  if (bedrooms == null) return null;
  return bathrooms == null ? `${bedrooms}PN` : `${bedrooms}PN${bathrooms}`;
}

export function buildListingTitle(_projectCode: string, _unitCode: string, areaSqm: number | string, bedrooms: number, bathrooms: number): string {
  const value = Number(areaSqm);
  const area = `${Number.isInteger(value) ? value.toFixed(0) : value}m²`;
  return `Căn hộ Q7 Riverside, ${bedrooms}PN ${bathrooms}WC, ${area}`;
}

export function formatRentPrice(price: number | string): string {
  const value = Number(price);
  return `${Number.isInteger(value) ? value.toFixed(0) : value}tr`;
}
