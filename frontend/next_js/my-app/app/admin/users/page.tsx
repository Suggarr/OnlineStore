"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, Shield, User } from "lucide-react";
import { toast } from "react-toastify";
import styles from "../admin.module.css";
import { useLocale } from "@/contexts/LocaleContext";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  roleValue: number;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<AdminUser[]>("/Users");
      setUsers((res.data as AdminUser[]) || []);
    } catch (err) {
      console.error(err);
      setError((err as Error)?.message || "Ошибка при загрузке пользователей");
    } finally {
      setLoading(false);
    }
  };

  // Локализация
  const { t } = useLocale();

  const handleDelete = async (id: string, role: string) => {
    if (role === "SuperAdmin") {
      toast.warn(t("admin.users.deleteForbidden"));
      return;
    }
    if (!confirm(t("admin.users.deleteConfirm"))) return;

    try {
      await apiClient.del(`/Users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(t("admin.users.deleteSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("admin.users.deleteFail"));
    }
  };

  const handleChangeRole = async (
    id: string,
    newRole: number,
    currentRole: string
  ) => {
    if (currentRole === "SuperAdmin") {
      toast.warn(t("admin.users.changeRoleForbidden", "Нельзя менять роль суперадминистратора"));
      return;
    }

    try {
      await apiClient.patch(`/Users/${id}/role`, { role: newRole });
      fetchUsers();
      toast.success(t("admin.users.changeRoleSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("admin.users.changeRoleFail"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h2 className={styles.sectionTitle}>
          <Shield size={24} />
          {t("admin.users.title")}
        </h2>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading ? (
            <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>{t("admin.users.loading")}</p>
          </div>
        ) : users.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3>{t("admin.users.notFoundTitle")}</h3>
            <p>{t("admin.users.notFoundText")}</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("admin.users.table.username", "Имя пользователя")}</th>
                  <th>{t("admin.users.table.email", "Email")}</th>
                  <th>{t("admin.users.table.role", "Роль")}</th>
                  <th>{t("admin.users.table.actions", "Действия")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: "#111827" }}>
                      {u.username}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          padding: "0.375rem 0.75rem",
                          background:
                            u.role === "SuperAdmin"
                              ? "#dcfce7"
                              : u.role === "Admin"
                                ? "#dbeafe"
                                : "#f3f4f6",
                          color:
                            u.role === "SuperAdmin"
                              ? "#15803d"
                              : u.role === "Admin"
                                ? "#0284c7"
                                : "#374151",
                          borderRadius: "0.375rem",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {u.role === "SuperAdmin" || u.role === "Admin" ? (
                          <Shield size={14} />
                        ) : (
                          <User size={14} />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {
                          // Вычисляем значение для select: если server вернул roleValue — используем его,
                          // иначе определяем по строковой роли. Для SuperAdmin добавляем опцию только для показа.
                        }
                        <select
                          value={
                            typeof u.roleValue === "number"
                              ? u.roleValue
                              : u.role === "Admin"
                              ? 1
                              : u.role === "SuperAdmin"
                              ? 2
                              : 0
                          }
                          onChange={(e) =>
                            handleChangeRole(u.id, Number(e.target.value), u.role)
                          }
                          disabled={u.role === "SuperAdmin"}
                          style={{
                            padding: "0.5rem 0.75rem",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            cursor:
                              u.role === "SuperAdmin" ? "not-allowed" : "pointer",
                            opacity: u.role === "SuperAdmin" ? 0.5 : 1,
                          }}
                        >
                          <option value={0}>{t("admin.users.role.user", "User")}</option>
                          <option value={1}>{t("admin.users.role.admin", "Admin")}</option>
                          {u.role === "SuperAdmin" && (
                            <option value={2} disabled>
                              {t("admin.users.role.superadmin", "SuperAdmin")}
                            </option>
                          )}
                        </select>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(u.id, u.role)}
                          disabled={u.role === "SuperAdmin"}
                          style={{
                            opacity: u.role === "SuperAdmin" ? 0.5 : 1,
                            cursor:
                              u.role === "SuperAdmin" ? "not-allowed" : "pointer",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}