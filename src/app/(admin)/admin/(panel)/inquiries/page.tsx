"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, DeleteButton, Notice, PageHeader, StatCard } from "@/components/admin/ui";
import { ArrowUpRight, LayoutGrid, Search, Trash } from "@/components/ui/Icons";
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي الاستفسارات"
          value={total}
          tone="ink"
          icon={<Search size={16} />}
        />
        <StatCard
          label="جديد"
          value={stats.new ?? 0}
          tone="gold"
          icon={<ArrowUpRight size={16} />}
        />
        <StatCard
          label="قيد المراجعة"
          value={stats.reviewing ?? 0}
          tone="teal"
          icon={<LayoutGrid size={16} />}
        />
        <StatCard
          label="مكتمل"
          value={stats.completed ?? 0}
          tone="green"
          icon={<Trash size={16} />}
        />
      </div>

      <div className="mt-6 space-y-4">
        <Card title="قائمة الاستفسارات" description={`عرض آخر ${total} استفسار وارد.`}>
          <div className="admin-table-wrap admin-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>اسم العميل</th>
                  <th>البريد الإلكتروني</th>
                  <th>الجوال</th>
                  <th>الخدمة المطلوبة</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="admin-table-empty">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-table-empty">
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
                      <tr key={inq.id}>
                        <td>
                          <span className="font-grotesk text-[11px] text-[#6c8085]" dir="ltr">
                            #{inq.id.slice(-6)}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold text-[#102a31]">{inq.name}</span>
                        </td>
                        <td>
                          <span className="text-[11px] text-[#6c8085]" dir="ltr">
                            {inq.email}
                          </span>
                        </td>
                        <td>
                          <span className="text-[11px] text-[#6c8085]" dir="ltr">
                            {inq.phone}
                          </span>
                        </td>
                        <td>{inq.service}</td>
                        <td>
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as ContactInquiry["status"])}
                            className="admin-input admin-select text-[10px] min-w-[130px]"
                            aria-label="حالة الاستفسار"
                          >
                            {Object.entries(STATUS_LABELS).map(([key, val]) => (
                              <option key={key} value={key}>
                                {val.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <span className="text-[11px] text-[#6c8085]" dir="ltr">
                            {date}
                          </span>
                        </td>
                        <td>
                          <DeleteButton onClick={() => handleDelete(inq.id)} label="حذف" />
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

