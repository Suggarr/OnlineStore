"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import styles from "../admin.module.css";
import { useLocale } from "@/contexts/LocaleContext";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Product[]>("/Products");
      setProducts((res.data as Product[]) || []);
    } catch (err) {
      console.error("fetchProducts error:", err);
      setError((err as Error)?.message || t("admin.products.errorLoad", "Ошибка загрузки товаров"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get<any[]>("/Categories");
      setCategories((res.data as any[]) || []);
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.products.deleteConfirm", "Вы уверены, что хотите удалить этот товар?"))) return;
    try {
      await apiClient.del(`/Products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("admin.products.deleteSuccess", "Товар удален"));
    } catch (err) {
      toast.error((err as Error)?.message || t("admin.products.deleteFail", "Ошибка удаления товара"));
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ name: "", description: "", price: 0, categoryId: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: 0, categoryId: "" });
  };

  const handleSubmit = async () => {
    // Отдельная проверка для категории — показываем понятное сообщение
    if (!formData.categoryId) {
      toast.warn(t("admin.products.chooseCategory", "Выберите категорию"));
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl) {
      toast.warn(t("admin.products.fillAll", "Заполните все поля (включая URL изображения)"));
      return;
    }

    try {
      if (editingId) {
        // При обновлении используем PUT и отправляем все поля
        const updateData = {
          id: editingId,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId || "",
          imageUrl: formData.imageUrl || "",
        };
        await (apiClient as any).put(`/Products/${editingId}`, updateData);
        toast.success(t("admin.products.saveSuccess", "Товар обновлен"));
      } else {
        // При создании отправляем все поля (включая imageUrl)
        const createData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId || "",
          imageUrl: formData.imageUrl || "",
        };
        await apiClient.post("/Products", createData);
        toast.success(t("admin.products.saveSuccess", "Товар добавлен"));
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error((err as Error)?.message || t("admin.products.saveFail", "Ошибка сохранения товара"));
    }
  };

  useEffect(() => {
    fetchProducts();
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
            <Package size={24} />
            {t("admin.products.title", "Управление товарами")}
          </h2>
          <button
            className={styles.addBtn}
            onClick={() => handleOpenModal()}
            title={t("admin.products.addProduct", "Добавить новый товар")}
          >
            <Plus size={18} /> {t("admin.products.addProduct", "Добавить товар")}
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
            <p>{t("admin.products.loading", "Загрузка товаров...")}</p>
          </div>
        ) : products.length === 0 ? (
            <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>{t("admin.products.notFoundTitle", "Товары не найдены")}</h3>
            <p>{t("admin.products.notFoundText", "Добавьте первый товар нажав кнопку выше")}</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("admin.products.table.name", "Название")}</th>
                  <th>{t("admin.products.table.description", "Описание")}</th>
                  <th>{t("admin.products.table.price", "Цена")}</th>
                  <th>{t("admin.products.table.actions", "Действия")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: "#111827" }}>
                      {p.name}
                    </td>
                    <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                      {p.description}
                    </td>
                    <td style={{ fontWeight: 600, color: "#2563eb" }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleOpenModal(p)}
                          title="Редактировать"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(p.id)}
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
              <h3 className={styles.modalHeader}>{editingId ? t("admin.products.modal.edit", "Редактировать товар") : t("admin.products.modal.add", "Добавить товар")}</h3>
              <button
                onClick={handleCloseModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.name", "Название")}</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("admin.products.placeholders.name", "Название товара")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.description", "Описание")}</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("admin.products.placeholders.description", "Описание товара")}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.price", "Цена")}</label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder={t("admin.products.placeholders.price", "Цена")}
                  step="0.01"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.imageUrl", "Ссылка на изображение")}</label>
                <input
                  type="text"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder={t("admin.products.placeholders.imageUrl", "https://.../image.jpg")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.category", "Категория")}</label>
                <select
                  value={formData.categoryId || ""}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">{t("admin.products.selectCategory", "Выберите категорию")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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

import { Package } from "lucide-react";