import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { prisma } from "@/prisma";
import DeleteButton from "../properties/DeleteButton";
import { deleteSell } from "@/app/actions/sell";
import { buildListingTitle, formatLayout } from "@/lib/listing-utils";

export const dynamic = "force-dynamic";

const pageSize = 20;
const typeFilters: Record<string, { bedrooms: number; bathrooms: number }> = {
  "1PN1": { bedrooms: 1, bathrooms: 1 },
  "2PN1": { bedrooms: 2, bathrooms: 1 },
  "2PN2": { bedrooms: 2, bathrooms: 2 },
  "3PN2": { bedrooms: 3, bathrooms: 2 },
};

export default async function SellPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string; sort?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const type = params.type ?? "all";
  const sort = params.sort ?? "created_desc";
  const where = typeFilters[type] ?? undefined;
  const orderBy = sort === "created_asc" ? { createdAt: "asc" as const } : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.sell.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.sell.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Giỏ hàng bán</h1>
          <p className="text-gray-text mt-1">Quản lý danh sách căn hộ đang chào bán.</p>
        </div>
        <Link href="/admin/sell/create" className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} />
          Thêm căn bán
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-3">
        <FilterSelect label="Loại căn" name="type" value={type} options={[["all", "Tất cả"], ...Object.keys(typeFilters).map((item) => [item, item])]} />
        <FilterSelect label="Sắp xếp" name="sort" value={sort} options={[["created_desc", "Mới nhất"], ["created_asc", "Cũ nhất"]]} />
        <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Áp dụng</button>
        <span className="ml-auto text-sm text-gray-text">{total} căn</span>
      </form>

      <div className="bg-white rounded-lg border border-gray-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-bg border-b border-gray-border text-sm text-gray-text font-medium">
            <tr>
              <th className="px-6 py-4">Căn</th>
              <th className="px-6 py-4">Layout</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4">Hiển thị</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-muted">Chưa có căn bán.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-bg/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-navy">{buildListingTitle(item.projectCode, item.unitCode, item.areaSqm.toString(), item.bedrooms, item.bathrooms)}</div>
                  <div className="text-xs text-gray-muted mt-1">{item.sourceName ?? "Không nguồn"} · {item.view ?? "Không view"}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-text">{formatLayout(item.bedrooms, item.bathrooms)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gold">{item.sellingPrice}</td>
                <td className="px-6 py-4 text-sm text-gray-text">{item.isVisible ? "Có" : "Ẩn public"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/sell/${item.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Sửa">
                      <Edit size={16} />
                    </Link>
                    <DeleteButton id={item.id} action={deleteSell} />
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
        <Link key={pageNumber} href={`/admin/sell?page=${pageNumber}&type=${type}&sort=${sort}`} className={`rounded-lg px-3 py-2 text-sm font-semibold ${pageNumber === page ? "bg-gold text-white" : "bg-white border border-gray-border text-gray-text"}`}>
          {pageNumber}
        </Link>
      ))}
    </div>
  );
}
