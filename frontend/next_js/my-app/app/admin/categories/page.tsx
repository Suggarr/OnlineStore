"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import styles from "../admin.module.css";
import { useLocale } from "@/contexts/LocaleContext";

type Category = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Category[]>("/Categories");
      setCategories((res.data as Category[]) || []);
    } catch (err) {
      console.error("fetchCategories error:", err);
      setError((err as Error)?.message || t("admin.categories.errorLoad", "Ошибка загрузки категорий"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.categories.deleteConfirm", "Вы уверены, что хотите удалить эту категорию?"))) return;
    try {
      await apiClient.del(`/Categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(t("admin.categories.deleteSuccess", "Категория удалена"));
    } catch (err) {
      toast.error((err as Error)?.message || t("admin.categories.deleteFail", "Ошибка удаления категории"));
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setFormData(category);
      setEditingId(category.id);
    } else {
      setFormData({ name: "", description: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.warn(t("admin.categories.fillAll", "Заполните все поля"));
      return;
    }

    try {
      if (editingId) {
        const updateData = {
          id: editingId,
          name: formData.name,
          description: formData.description,
        };
        await (apiClient as any).put(`/Categories/${editingId}`, updateData);
        toast.success(t("admin.categories.saveSuccess", "Категория обновлена"));
      } else {
        await apiClient.post("/Categories", formData);
        toast.success(t("admin.categories.saveSuccess", "Категория добавлена"));
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error((err as Error)?.message || t("admin.categories.saveFail", "Ошибка сохранения категории"));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const { t } = useLocale();

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <h2 className={styles.sectionTitle}>
            <Tag size={24} />
            {t("admin.categories.title", "Управление категориями")}
          </h2>
          <button
            className={styles.addBtn}
            onClick={() => handleOpenModal()}
            title="Добавить новую категорию"
          >
            <Plus size={18} /> {t("admin.categories.addCategory", "Добавить категорию")}
          </button>
        </div>

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
            <p>{t("admin.categories.loading", "Загрузка категорий...")}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>{t("admin.categories.notFoundTitle", "Категории не найдены")}</h3>
            <p>{t("admin.categories.notFoundText", "Добавьте первую категорию нажав кнопку выше")}</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("admin.categories.table.name", "Название")}</th>
                  <th>{t("admin.categories.table.description", "Описание")}</th>
                  <th>{t("admin.categories.table.actions", "Действия")}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: "#111827" }}>
                      {c.name}
                    </td>
                    <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                      {c.description}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleOpenModal(c)}
                          title="Редактировать"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(c.id)}
                          title="Удалить"
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

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} style={{ display: "flex" }}>
          <div className={styles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 className={styles.modalHeader}>{editingId ? t("admin.categories.modal.edit", "Редактировать категорию") : t("admin.categories.modal.add", "Добавить категорию")}</h3>
              <button
                onClick={handleCloseModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("admin.categories.fields.name", "Название")}</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("admin.categories.placeholders.name", "Название категории")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.categories.fields.description", "Описание")}</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("admin.categories.placeholders.description", "Описание категории")}
                  rows={4}
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                  {editingId ? t("common.save", "Сохранить") : t("common.add", "Добавить")}
                </button>
                <button className={styles.cancelBtn} onClick={handleCloseModal}>
                  {t("common.cancel", "Отмена")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { Tag } from "lucide-react";