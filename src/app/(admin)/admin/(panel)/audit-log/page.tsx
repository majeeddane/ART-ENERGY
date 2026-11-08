"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { Activity, Clock, User } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { type AdminAuditLog } from "@/lib/store";

const ACTION_LABELS: Record<string, string> = {
  "login": "تسجيل دخول",
  "logout": "تسجيل خروج",
  "create_user": "إضافة مستخدم",
  "update_user": "تعديل مستخدم",
  "delete_user": "حذف مستخدم",
  "update_settings": "تعديل إعدادات",
  "update_content": "تعديل محتوى",
  "update_section": "تعديل قسم",
  "upload_image": "رفع صورة",
  "delete_image": "حذف صورة",
  "create_inquiry": "استفسار تواصل",
  "update_inquiry": "تعديل حالة استفسار",
  "delete_inquiry": "حذف استفسار",
};

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("limit", "100");
        if (userFilter) params.set("userId", userFilter);
        if (actionFilter) params.set("action", actionFilter);

        const res = await fetch(`/api/admin/audit-log?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل تحميل سجل النشاطات");
        setLogs(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير معروف");
      } finally {
        setLoading(false);
      }
    })();
  }, [userFilter, actionFilter]);

  const uniqueUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.user_email));
    return Array.from(set);
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  return (
    <div>
      <PageHeader
        eyebrow="AUDIT LOG / سجل النشاطات"
        title="سجل نشاطات الإدارة"
        description="سجل لجميع العمليات التي يقوم بها المسؤولون والمحررون في لوحة التحكم، بما في ذلك التعديلات والحذف والإضافة."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="admin-input text-[10px] min-w-[160px]"
        >
          <option value="">جميع المستخدمين</option>
          {uniqueUsers.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="admin-input text-[10px] min-w-[160px]"
        >
          <option value="">جميع الإجراءات</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
          ))}
        </select>
      </div>

      {error && <Notice tone="danger">{error}</Notice>}

      <div className="mt-6">
        <Card title="سجل العمليات" description={`عرض آخر ${logs.length} عملية مسجلة.`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E0D3] bg-[#FCFAF5]">
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">التاريخ والوقت</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">المستخدم</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الإجراء</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">نوع الهدف</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">تفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      لا توجد أنشطة مسجلة بعد.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const date = new Date(log.created_at).toLocaleString("ar-SA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <tr key={log.id} className="border-b border-[#E7E0D3] hover:bg-[#F9F7F2] transition-colors">
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{date}</td>
                        <td className="px-3.5 py-3 text-sm text-[#0B2730]">{log.user_email}</td>
                        <td className="px-3.5 py-3 text-xs text-[#6A7D80]">
                          {ACTION_LABELS[log.action] || log.action}
                        </td>
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{log.target_type}</td>
                        <td className="px-3.5 py-3 text-xs text-[#6A7D80]">{log.details ?? "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
