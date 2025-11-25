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
      setError("Ошибка загрузки категорий");
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
    if (!confirm("Удалить категорию?")) return;

    try {
      await apiClient.del(`/Categories/${id}`);
      setCategories((prev) => prev.filter((x) => x.id !== id));
      toast.success("Категория удалена");
    } catch (err) {
      toast.error("Ошибка удаления");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.name.length > 50) {
      toast.warn("Название должно быть до 50 символов");
      return;
    }

    if (!formData.image || !/^https?:\/\/.+\..+/.test(formData.image)) {
      toast.warn("Введите корректный URL изображения");
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/Categories/${editingId}`, formData);
        toast.success("Категория обновлена");
      } else {
        await apiClient.post("/Categories", formData);
        toast.success("Категория добавлена");
      }

      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast.error("Ошибка сохранения");
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
            Управление категориями
          </h2>

          <button className={styles.addBtn} onClick={() => handleOpenModal()}>
            <Plus size={18} /> Добавить категорию
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
            <p>Загрузка категорий...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>Категорий нет</h3>
            <p>Добавьте первую категорию</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Действия</th>
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
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleOpenModal(c)}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(c.id)}
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
                {editingId ? "Редактировать категорию" : "Добавить категорию"}
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
                <label>Название</label>
                <input
                  type="text"
                  maxLength={50}
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea
                  maxLength={600}
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>URL изображения</label>
                <input
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                  {editingId ? "Сохранить" : "Добавить"}
                </button>

                <button className={styles.cancelBtn} onClick={handleCloseModal}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
