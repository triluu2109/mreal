import type { ReactNode } from "react";

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-gray-border bg-gray-bg text-xs font-semibold uppercase tracking-wide text-gray-text">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-3.5">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
