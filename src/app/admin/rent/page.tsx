import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import DeleteButton from "../properties/DeleteButton";
import { deleteRentalListing } from "@/app/actions/rent";
import { buildListingTitle, formatLayout } from "@/lib/listing-utils";
import ListingToggleButton from "@/app/admin/_components/ListingToggleButton";
import { requirePagePermission } from "@/lib/admin/auth";
import { hasPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

const pageSize = 20;
const typeFilters: Record<string, { bedrooms: number; bathrooms: number }> = {
  "1PN1": { bedrooms: 1, bathrooms: 1 },
  "2PN1": { bedrooms: 2, bathrooms: 1 },
  "2PN2": { bedrooms: 2, bathrooms: 2 },
  "3PN2": { bedrooms: 3, bathrooms: 2 },
};

export default async function RentPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string; sort?: string }> }) {
  const admin = await requirePagePermission("listings.read");
  const canCreate = hasPermission(admin.role, admin.permissions, "listings.create");
  const canUpdate = hasPermission(admin.role, admin.permissions, "listings.update");
  const canDelete = hasPermission(admin.role, admin.permissions, "listings.delete_soft");
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const type = params.type ?? "all";
  const sort = params.sort ?? "created_desc";
  const where = { ...(typeFilters[type] ?? {}), deletedAt: null };
  const orderBy =
    sort === "created_asc" ? { createdAt: "asc" as const } :
    sort === "price_asc" ? { rentPrice: "asc" as const } :
    sort === "price_desc" ? { rentPrice: "desc" as const } :
    { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.rentalListing.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.rentalListing.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Giỏ hàng thuê</h1>
          <p className="text-gray-text mt-1">Quản lý danh sách căn hộ cho thuê.</p>
        </div>
        {canCreate ? <Link href="/admin/rent/create" className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} />
          Thêm căn thuê
        </Link> : null}
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-3">
        <FilterSelect label="Loại căn" name="type" value={type} options={[["all", "Tất cả"], ...Object.keys(typeFilters).map((item) => [item, item])]} />
        <FilterSelect label="Sắp xếp" name="sort" value={sort} options={[["created_desc", "Mới nhất"], ["created_asc", "Cũ nhất"], ["price_asc", "Giá thấp - cao"], ["price_desc", "Giá cao - thấp"]]} />
        <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Áp dụng</button>
        <span className="ml-auto text-sm text-gray-text">{total} căn</span>
      </form>

      <div className="bg-white rounded-lg border border-gray-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-bg border-b border-gray-border text-sm text-gray-text font-medium">
            <tr>
              <th className="px-6 py-4">Mã căn</th>
              <th className="px-6 py-4">Căn</th>
              <th className="px-6 py-4">Layout</th>
              <th className="px-6 py-4">Giá thuê</th>
              <th className="px-6 py-4">Nội thất</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {items.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-muted">Chưa có căn thuê.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-bg/50">
                <td className="px-6 py-4 font-mono text-sm text-navy whitespace-nowrap">{item.unitCode}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-navy">{buildListingTitle(item.projectCode, item.unitCode, item.areaSqm.toString(), item.bedrooms, item.bathrooms)}</div>
                  <div className="text-xs text-gray-muted mt-1">{item.sourceName ?? "Không nguồn"} - {item.availability ?? "Không tình trạng"}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-text whitespace-nowrap">{formatLayout(item.bedrooms, item.bathrooms)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gold whitespace-nowrap">{item.displayPrice}</td>
                <td className="px-6 py-4 text-xs text-gray-text whitespace-nowrap">{FURNISHING_LABELS[item.furnishingStatus]}</td>
                <td className="px-6 py-4 text-sm text-gray-text whitespace-nowrap">
                  <div>{item.isVisible ? "Đang hiện" : "Đang ẩn"}</div>
                  <div className={item.isFeatured ? "text-gold font-semibold" : "text-gray-muted"}>{item.isFeatured ? "Nổi bật" : "Thường"}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {canUpdate ? <ListingToggleButton id={item.id} kind="rent" field="visible" value={item.isVisible} /> : null}
                    {canUpdate ? <ListingToggleButton id={item.id} kind="rent" field="featured" value={item.isFeatured} /> : null}
                    {canUpdate ? <Link href={`/admin/rent/${item.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Sửa">
                      <Edit size={16} />
                    </Link> : null}
                    {canDelete ? <DeleteButton id={item.id} action={deleteRentalListing} /> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} type={type} sort={sort} />
    </div>
  );
}

const FURNISHING_LABELS: Record<string, string> = {
  DEVELOPER_HANDOVER: "Hoàn thiện cơ bản",
  BASIC_FURNISHED: "Nội thất cơ bản",
  FULLY_FURNISHED: "Full nội thất",
};

function FilterSelect({ label, name, value, options }: { label: string; name: string; value: string; options: string[][] }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm text-gray-text">{label}</span>
      <select name={name} defaultValue={value} className="rounded-lg border border-gray-border bg-white px-3 py-2 text-sm">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function Pagination({ page, totalPages, type, sort }: { page: number; totalPages: number; type: string; sort: string }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Link key={pageNumber} href={`/admin/rent?page=${pageNumber}&type=${type}&sort=${sort}`} className={`rounded-lg px-3 py-2 text-sm font-semibold ${pageNumber === page ? "bg-gold text-white" : "bg-white border border-gray-border text-gray-text"}`}>
          {pageNumber}
        </Link>
      ))}
    </div>
  );
}
