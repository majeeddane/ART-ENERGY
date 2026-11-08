"use client";

import { useEffect, useState } from "react";
import {
  AddButton,
  Card,
  DeleteButton,
  Notice,
  PageHeader,
  StatCard,
} from "@/components/admin/ui";
import { Globe, Lock, User } from "@/components/ui/Icons";
import { type AdminUser, type AdminUserRole } from "@/lib/store";

const ROLE_LABELS: Record<AdminUserRole, { label: string; badge: string }> = {
  admin: { label: "مدير النظام", badge: "admin-badge-warn" },
  editor: { label: "محرر", badge: "admin-badge-info" },
  viewer: { label: "مشاهد", badge: "admin-badge-neutral" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
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
      setShowAdd(false);
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
      setError(err instanceof Error ? err.message : "فشل تحديث صلاحيات المستخدم");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!window.confirm("هل أنت متأكد أن تريد حذف هذا المستخدم؟")) return;
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

  return (
    <div>
      <PageHeader
        eyebrow="USERS / إدارة المستخدمين"
        title="المستخدمون والصلاحيات"
        description="إدارة المسؤولين والمحررين والمشاهدين، وتحديد صلاحيات الوصول لكل قسم في لوحة التحكم."
      >
        <AddButton
          label={showAdd ? "إغلاق النموذج" : "إضافة مستخدم"}
          onClick={() => {
            setShowAdd((value) => !value);
            setError(null);
          }}
        />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="إجمالي المستخدمين" value={total} tone="ink" icon={<User size={16} />} />
        <StatCard label="نشط" value={active} tone="green" icon={<Globe size={16} />} />
        <StatCard label="مديرون نظام" value={admins} tone="gold" icon={<Lock size={16} />} />
      </div>

      {error && (
        <div className="mt-4">
          <Notice tone="danger">{error}</Notice>
        </div>
      )}

      {showAdd && (
        <div className="mt-4">
          <Card
            title="إضافة مستخدم جديد"
            description="سيتمكن المستخدم من الدخول إلى لوحة التحكم حسب الدور المحدد."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="admin-label" htmlFor="new-user-name">
                  الاسم
                </label>
                <input
                  id="new-user-name"
                  className="admin-input"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <label className="admin-label" htmlFor="new-user-email">
                  البريد الإلكتروني
                </label>
                <input
                  id="new-user-email"
                  type="email"
                  dir="ltr"
                  className="admin-input"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="name@artenergy.sa"
                />
              </div>
              <div>
                <label className="admin-label" htmlFor="new-user-password">
                  كلمة المرور
                </label>
                <input
                  id="new-user-password"
                  type="password"
                  dir="ltr"
                  className="admin-input"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="admin-label" htmlFor="new-user-role">
                  الدور
                </label>
                <select
                  id="new-user-role"
                  className="admin-input admin-select"
                  value={newRole}
                  onChange={(event) => setNewRole(event.target.value as AdminUserRole)}
                >
                  <option value="admin">مدير النظام</option>
                  <option value="editor">محرر</option>
                  <option value="viewer">مشاهد</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddUser}
                disabled={loading}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                إضافة المستخدم
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setError(null);
                }}
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                إلغاء
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <Card title="قائمة المستخدمين" description={`إجمالي ${users.length} مستخدم مسجل في النظام.`}>
          <div className="admin-table-wrap admin-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الدور</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">
                      لا توجد مستخدمين بعد.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const roleInfo = ROLE_LABELS[u.role as AdminUserRole] ?? ROLE_LABELS.viewer;
                    return (
                      <tr key={u.id}>
                        <td>
                          <span className="font-semibold text-[#102a31]">{u.name}</span>
                        </td>
                        <td>
                          <span className="text-[11px] text-[#6c8085]" dir="ltr">
                            {u.email}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge ${roleInfo.badge}`}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td>
                          <select
                            value={u.is_active ? "active" : "inactive"}
                            onChange={(e) =>
                              handleRoleChange(u.id, u.role as AdminUserRole, e.target.value === "active")
                            }
                            className="admin-input admin-select text-[10px] min-w-[110px]"
                            aria-label="حالة المستخدم"
                          >
                            <option value="active">نشط</option>
                            <option value="inactive">معطل</option>
                          </select>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u.id, e.target.value as AdminUserRole, u.is_active)
                              }
                              className="admin-input admin-select text-[10px] min-w-[130px]"
                              aria-label="دور المستخدم"
                            >
                              <option value="admin">مدير النظام</option>
                              <option value="editor">محرر</option>
                              <option value="viewer">مشاهد</option>
                            </select>
                            <DeleteButton onClick={() => handleDeleteUser(u.id)} label="حذف" />
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
          يتضمن النظام ثلاثة أدوار: <strong>مدير النظام</strong> (صلاحية كاملة)،
          <strong> محرر</strong> (تعديل المحتوى والأقسام والوسائط)، و
          <strong> مشاهد</strong> (عرض فقط). لا يمكن حذف المستخدم الذي يقوم بتسجيل الدخول حالياً.
        </Notice>
      </div>
    </div>
  );
}
