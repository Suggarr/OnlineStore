"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, Edit2, Plus, X, FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import styles from "../admin.module.css";
import { useLocale } from "@/contexts/LocaleContext";

type Category = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { t } = useLocale();

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get<Category[]>("/Categories");
      setCategories(res.data || []);
    } catch (err) {
      setError(t("admin.categories.errorLoad", "Ошибка загрузки категорий"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData(cat);
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", image: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", description: "", image: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.categories.deleteConfirm", "Вы уверены, что хотите удалить эту категорию?"))) return;

    try {
      await apiClient.del(`/Categories/${id}`);
      setCategories((prev) => prev.filter((x) => x.id !== id));
      toast.success(t("admin.categories.deleteSuccess", "Категория удалена"));
    } catch (err) {
      toast.error(t("admin.categories.deleteFail", "Ошибка удаления категории"));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.name.length < 3 || formData.name.length > 100) {
      toast.warn(t("admin.categories.warn.name", "Название категории должно содержать от 3 до 100 символов"));
      return;
    }

    if (!formData.description || formData.description.length < 5 || formData.description.length > 600) {
      toast.warn(t("admin.categories.warn.description", "Описание должно содержать от 5 до 600 символов"));
      return;
    }

    if (!formData.image || formData.image.length < 10 || formData.image.length > 300 || !/^https?:\/\/.+\..+/.test(formData.image)) {
      toast.warn(t("admin.categories.warn.image", "Ссылка на изображение должна быть валидным URL от 10 до 300 символов"));
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/Categories/${editingId}`, formData);
        toast.success(t("admin.categories.updateSuccess", "Категория обновлена"));
      } else {
        await apiClient.post("/Categories", formData);
        toast.success(t("admin.categories.addSuccess", "Категория добавлена"));
      }

      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast.error(t("admin.categories.saveFail", "Ошибка сохранения категории"));
    }
  };

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 className={styles.sectionTitle}>
            <FolderTree size={24} />
            {t("admin.categories.title", "Управление категориями")}
          </h2>

          <button className={styles.addBtn} onClick={() => handleOpenModal()}>
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
            <div className={styles.emptyIcon}>📭</div>
            <h3>{t("admin.categories.notFoundTitle", "Категории не найдены")}</h3>
            <p>{t("admin.categories.notFoundText", "Добавьте первую категорию нажав кнопку выше")}</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("admin.categories.table.photo", "Фото")}</th>
                  <th>{t("admin.categories.table.name", "Название")}</th>
                  <th>{t("admin.categories.table.description", "Описание")}</th>
                  <th>{t("admin.categories.table.actions", "Действия")}</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "#eee",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </td>

                    <td style={{ fontWeight: 600 }}>{c.name}</td>

                    <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                      {c.description || "-"}
                    </td>

                    <td>
                      <div className={styles.actions} style={{ display: "flex", gap: "12px" }}>
                        <button 
                          className={styles.editBtn} 
                          onClick={() => handleOpenModal(c)}
                          title={t("common.edit", "Редактировать")}
                          aria-label={t("common.edit", "Редактировать")}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            backgroundColor: "#3498db",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease, transform 0.1s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#2980b9";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#3498db";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <Edit2 size={20} />
                          {t("common.edit", "Редактировать")}
                        </button>
                        <button 
                          className={styles.deleteBtn} 
                          onClick={() => handleDelete(c.id)}
                          title={t("common.delete", "Удалить")}
                          aria-label={t("common.delete", "Удалить")}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            backgroundColor: "#e74c3c",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease, transform 0.1s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#c0392b";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#e74c3c";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <Trash2 size={20} />
                          {t("common.delete", "Удалить")}
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

      {showModal && (
        <div className={styles.modal} style={{ display: "flex" }}>
          <div className={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h3 className={styles.modalHeader}>
                {editingId ? t("admin.categories.modal.edit", "Редактировать категорию") : t("admin.categories.modal.add", "Добавить категорию")}
              </h3>

              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("admin.categories.fields.name", "Название")}</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("admin.categories.placeholders.name", "Название категории")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.categories.fields.description", "Описание")}</label>
                <textarea
                  maxLength={600}
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("admin.categories.placeholders.description", "Описание категории")}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.categories.fields.image", "Ссылка на изображение")}</label>
                <input
                  type="url"
                  maxLength={300}
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder={t("admin.categories.placeholders.image", "https://.../image.jpg")}
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