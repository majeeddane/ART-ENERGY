"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, DeleteButton, Notice, PageHeader } from "@/components/admin/ui";
import { ArrowUpRight, LayoutGrid, Search, Trash } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { type ContactInquiry } from "@/lib/store";

const STATUS_LABELS: Record<string, { label: string; colorClass: string }> = {
  new: { label: "جديد", colorClass: "text-[#B8873A] border-[#DDB55C]/30 bg-[#DDB55C]/10" },
  reviewing: { label: "قيد المراجعة", colorClass: "text-[#139CAA] border-[#139CAA]/30 bg-[#139CAA]/10" },
  contacted: { label: "تم التواصل", colorClass: "text-[#3DC1C5] border-[#3DC1C5]/30 bg-[#3DC1C5]/10" },
  completed: { label: "مكتمل", colorClass: "text-[#2C6B44] border-[#2C6B44]/30 bg-[#2C6B44]/10" },
  closed: { label: "مغلق", colorClass: "text-[#A9362E] border-[#A9362E]/30 bg-[#A9362E]/10" },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ContactInquiry["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "100");

        const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل تحميل الاستفسارات");
        setInquiries(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير معروف");
      } finally {
        setLoading(false);
      }
    })();
  }, [statusFilter, search]);

  async function handleStatusChange(id: string, status: ContactInquiry["status"]) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("فشل تحديث الحالة");
      const data = await res.json();
      setInquiries((items) => items.map((i) => (i.id === id ? data.data : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث حالة الاستفسار");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الاستفسار؟")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setInquiries((items) => items.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل حذف الاستفسار");
    }
  }

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    inquiries.forEach((i) => {
      counts[i.status] = (counts[i.status] ?? 0) + 1;
    });
    return counts;
  }, [inquiries]);

  return (
    <div>
      <PageHeader
        eyebrow="INQUIRIES / استفسارات التواصل"
        title="استفسارات العملاء"
        description="إدارة جميع الطلبات الواردة من نموذج التواصل في الموقع. يمكنك تحديث حالة كل طلب ومتابعة التواصل مع العملاء."
      >
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContactInquiry["status"] | "all")}
            className="admin-input text-[10px] min-w-[140px]"
          >
            <option value="all">الحالة: الكل</option>
            <option value="new">جديد</option>
            <option value="reviewing">قيد المراجعة</option>
            <option value="contacted">تم التواصل</option>
            <option value="completed">مكتمل</option>
            <option value="closed">مغلق</option>
          </select>
          <input
            type="text"
            placeholder="البحث باسم أو بريد أو جوال…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input text-[10px] min-w-[200px]"
          />
        </div>
      </PageHeader>

      {error && <Notice tone="danger">{error}</Notice>}

      {/* بطاقات الإحصائيات */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الاستفسارات" value={total} color="text-[#0B2730]" icon={<Search size={16} />} />
        <StatCard label="جديد" value={stats.new ?? 0} color="text-[#B8873A]" icon={<ArrowUpRight size={16} />} />
        <StatCard
          label="قيد المراجعة"
          value={stats.reviewing ?? 0}
          color="text-[#139CAA]"
          icon={<LayoutGrid size={16} />}
        />
        <StatCard label="مكتمل" value={stats.completed ?? 0} color="text-[#2C6B44]" icon={<Trash size={16} />} />
      </div>

      <div className="mt-6">
        <Card title="قائمة الاستفسارات" description={`عرض آخر ${total} استفسار وارد.`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E0D3] bg-[#FCFAF5]">
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الرقم</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">اسم العميل</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">البريد الإلكتروني</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الجوال</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الخدمة المطلوبة</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B] [&>*:last-child]:text-right">الحالة</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B] [&>*:last-child]:text-right">التاريخ</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B] text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      لا توجد استفسارات تطابق معايير البحث.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => {
                    const date = new Date(inq.created_at).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                    return (
                      <tr key={inq.id} className="border-b border-[#E7E0D3] hover:bg-[#F9F7F2] transition-colors">
                        <td className="px-3.5 py-3 text-xs font-grotesk text-[#6A7D80] dir-ltr">{inq.id.slice(-6)}</td>
                        <td className="px-3.5 py-3 text-sm text-[#0B2730]">{inq.name}</td>
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{inq.email}</td>
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{inq.phone}</td>
                        <td className="px-3.5 py-3 text-sm text-[#0B2730]">{inq.service}</td>
                        <td className="px-3.5 py-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as ContactInquiry["status"])}
                            className="admin-input text-[10px] text-left min-w-[120px]"
                          >
                            {Object.entries(STATUS_LABELS).map(([key, val]) => (
                              <option key={key} value={key} className={val.colorClass}>
                                {val.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{date}</td>
                        <td className="px-3.5 py-3 text-right">
                          <DeleteButton onClick={() => handleDelete(inq.id)} label="حذف" className="mr-2" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Notice tone="info">
          الحالات تُحدّث فوراً في قاعدة البيانات وتظهر للزوار في لوحة الإدارة فقط. لا يُعرض أي من هذه
          البيانات على واجهة الموقع العامة.
        </Notice>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#6A7D80]">{label}</p>
          <p className={cn("mt-1 font-display text-2xl leading-none", color)}>{value}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2E04E]/20 border border-[#F2E04E]/40">
          {icon}
        </div>
      </div>
    </Card>
  );
}
