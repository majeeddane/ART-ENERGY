"use client";

import { useEffect, useState } from "react";
import { AddButton, Card, DeleteButton, Notice, PageHeader } from "@/components/admin/ui";
import { Globe, Lock, User } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { type AdminUser, type AdminUserRole } from "@/lib/store";

const ROLE_LABELS: Record<AdminUserRole, { label: string; color: string }> = {
  admin: { label: "مدير النظام", color: "text-[#B8873A] border-[#DDB55C]/30 bg-[#DDB55C]/10" },
  editor: { label: "محرر", color: "text-[#139CAA] border-[#139CAA]/30 bg-[#139CAA]/10" },
  viewer: { label: "مشاهد", color: "text-[#6A7D80] border-[#DED5C4]/30 bg-[#DED5C4]/10" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminUserRole>("editor");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل تحميل المستخدمين");
        setUsers(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير معروف");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAddUser() {
    if (!newEmail || !newName || !newPassword) {
      setError("الرجاء ملء جميع الحقول");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, role: newRole, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إضافة المستخدم");
      setUsers((prev) => [...prev, data.data]);
      setNewEmail("");
      setNewName("");
      setNewRole("editor");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة المستخدم");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, role: AdminUserRole, isActive: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, is_active: isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل التحديث");
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.data : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث роль المستخدم");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل حذف المستخدم");
    } finally {
      setLoading(false);
    }
  }

  const total = users.length;
  const active = users.filter((u) => u.is_active).length;
  const admins = users.filter((u) => u.role === "admin").length;
  const stats = { total, active, admins };

  return (
    <div>
      <PageHeader
        eyebrow="USERS / إدارة المستخدمين"
        title="المستخدمون والصلاحيات"
        description="إدارة المسؤولين والمحررين والمشاهدين، وتحديد صلاحيات الوصول لكل قسم في لوحة التحكم."
      >
        <AddButton label="إضافة مستخدم" onClick={handleAddUser} className="mt-4" />
      </PageHeader>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="إجمالي المستخدمين" value={total} color="text-[#0B2730]" icon={<User size={16} />} />
        <StatCard label="نشط" value={active} color="text-[#2C6B44]" icon={<Globe size={16} />} />
        <StatCard label="مديرون نظام" value={admins} color="text-[#B8873A]" icon={<Lock size={16} />} />
      </div>

      {error && <Notice tone="danger">{error}</Notice>}

      {/* بطاقات الإحصائيات */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="إجمالي المستخدمين" value={stats.total} color="text-[#0B2730]" icon={<User size={16} />} />
        <StatCard label="نشط" value={stats.active} color="text-[#2C6B44]" icon={<Globe size={16} />} />
        <StatCard label="مديرون نظام" value={stats.admins} color="text-[#B8873A]" icon={<Lock size={16} />} />
      </div>

      <div className="mt-6">
        <Card title="قائمة المستخدمين" description={`إجمالي ${users.length} مستخدم مسجل في النظام.`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E0D3] bg-[#FCFAF5]">
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الاسم</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">البريد الإلكتروني</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الدور</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B]">الحالة</th>
                  <th className="px-3.5 py-3 text-[10px] font-semibold text-[#14262B] text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3.5 py-8 text-center text-xs text-[#8A979B]">
                      لا توجد مستخدمين بعد.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const roleInfo = ROLE_LABELS[u.role as AdminUserRole] ?? ROLE_LABELS.viewer;
                    return (
                      <tr key={u.id} className="border-b border-[#E7E0D3] hover:bg-[#F9F7F2] transition-colors">
                        <td className="px-3.5 py-3 text-sm text-[#0B2730]">{u.name}</td>
                        <td className="px-3.5 py-3 text-xs dir-ltr text-[#6A7D80]">{u.email}</td>
                        <td className="px-3.5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="px-3.5 py-3">
                          <select
                            value={u.is_active ? "active" : "inactive"}
                            onChange={(e) => handleRoleChange(u.id, u.role as AdminUserRole, e.target.value === "active")}
                            className="admin-input text-[10px] text-left min-w-[100px]"
                          >
                            <option value="active">نشط</option>
                            <option value="inactive">معطل</option>
                          </select>
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex items-center gap-1">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUserRole, u.is_active)}
                              className="admin-input text-[10px] text-left min-w-[120px]"
                            >
                              <option value="admin">مدير النظام</option>
                              <option value="editor">محرر</option>
                              <option value="viewer">مشاهد</option>
                            </select>
                            <DeleteButton
                              onClick={() => handleDeleteUser(u.id)}
                              label="حذف"
                              className="ml-1"
                            />
                          </div>
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
          يتضمن النظام دورين رئيسيين: <strong>مدير النظام</strong> (صلاحية كاملة)،
          <strong>محرر</strong> (تعديل المحتوى والأقسام والوسائط)، و
          <strong>مشاهد</strong> (عرض فقط). لا يمكن حذف المستخدم الذي يقوم بتسجيل الدخول حالياً.
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
