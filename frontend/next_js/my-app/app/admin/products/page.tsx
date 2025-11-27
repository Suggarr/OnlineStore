"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Trash2, Edit2, Plus, X, Package } from "lucide-react";
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
  categoryName?: string;
};

type Category = {
  id: string;
  name: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const { t } = useLocale();

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get<Category[]>("/Categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Product[]>("/Products");
      const productsWithCategory = (res.data || []).map((p: Product) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        return { ...p, categoryName: cat ? cat.name : "-" };
      });
      setProducts(productsWithCategory);
    } catch (err) {
      console.error(err);
      setError(t("admin.products.errorLoad", "Ошибка загрузки товаров"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) fetchProducts();
  }, [categories]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ name: "", description: "", price: 0, categoryId: "", imageUrl: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: 0, categoryId: "", imageUrl: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.products.deleteConfirm", "Вы уверены, что хотите удалить этот товар?"))) return;
    try {
      await apiClient.del(`/Products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("admin.products.deleteSuccess", "Товар удален"));
    } catch (err) {
      toast.error(t("admin.products.deleteFail", "Ошибка удаления товара"));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.name.length < 3 || formData.name.length > 100) {
      toast.warn(t("admin.products.warn.name", "Название товара должно содержать от 3 до 100 символов"));
      return;
    }
    if (!formData.description || formData.description.length < 5 || formData.description.length > 500) {
      toast.warn(t("admin.products.warn.description", "Описание товара должно содержать от 5 до 500 символов"));
      return;
    }
    if (!formData.price || formData.price < 0.01 || formData.price > 100000) {
      toast.warn(t("admin.products.warn.price", "Цена должна быть в диапазоне от 0.01 до 100000"));
      return;
    }
    if (!formData.imageUrl || formData.imageUrl.length < 10 || formData.imageUrl.length > 300 || !/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      toast.warn(t("admin.products.warn.imageUrl", "URL изображения должен быть валидным от 10 до 300 символов"));
      return;
    }
    if (!formData.categoryId) {
      toast.warn(t("admin.products.warn.category", "Категория обязательна"));
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/Products/${editingId}`, formData);
        toast.success(t("admin.products.updateSuccess", "Товар обновлен"));
      } else {
        await apiClient.post("/Products", formData);
        toast.success(t("admin.products.addSuccess", "Товар добавлен"));
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      toast.error(t("admin.products.saveFail", "Ошибка сохранения товара"));
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
            <Package size={24} />
            {t("admin.products.title", "Управление товарами")}
          </h2>
          <button className={styles.addBtn} onClick={() => handleOpenModal()}>
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
                  <th>{t("admin.products.table.photo", "Фото")}</th>
                  <th>{t("admin.products.table.name", "Название")}</th>
                  <th>{t("admin.products.table.description", "Описание")}</th>
                  <th>{t("admin.products.table.category", "Категория")}</th>
                  <th>{t("admin.products.table.price", "Цена")}</th>
                  <th>{t("admin.products.table.actions", "Действия")}</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    {/* Фото */}
                    <td>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
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

                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>{p.description}</td>

                    <td style={{ color: "#6b7280", fontWeight: 500 }}>
                      {p.categoryName}
                    </td>

                    <td style={{ fontWeight: 600, color: "#2563eb" }}>
                      ${p.price.toFixed(2)}
                    </td>

                    <td>
                      <div className={styles.actions} style={{ display: "flex", gap: "12px" }}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleOpenModal(p)}
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
                          onClick={() => handleDelete(p.id)}
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 className={styles.modalHeader}>
                {editingId ? t("admin.products.modal.edit", "Редактировать товар") : t("admin.products.modal.add", "Добавить товар")}
              </h3>
              <button onClick={handleCloseModal} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.name", "Название")}</label>
                <input type="text" maxLength={100} value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t("admin.products.placeholders.name", "Название товара")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.description", "Описание")}</label>
                <textarea maxLength={500} rows={4} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t("admin.products.placeholders.description", "Описание товара")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.price", "Цена")}</label>
                <input type="number" min={0.01} max={100000} step="0.01" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} placeholder={t("admin.products.placeholders.price", "Цена")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.imageUrl", "Ссылка на изображение")}</label>
                <input type="url" maxLength={300} value={formData.imageUrl || ""} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder={t("admin.products.placeholders.imageUrl", "https://.../image.jpg")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("admin.products.fields.category", "Категория")}</label>
                <select value={formData.categoryId || ""} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                  <option value="">{t("admin.products.placeholders.chooseCategory", "Выберите категорию")}</option>
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