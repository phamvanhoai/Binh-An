import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPagination({
  page,
  totalPages,
  params
}: {
  page: number;
  totalPages: number;
  params: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function href(nextPage: number) {
    const search = new URLSearchParams(params);
    search.set("page", String(nextPage));
    return `?${search.toString()}`;
  }

  return (
    <nav className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
      <span className="text-slate-500">
        Trang {page}/{totalPages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">
            <ChevronLeft size={15} aria-hidden="true" />
            Trước
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={href(page + 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">
            Sau
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
