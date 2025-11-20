"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { CategoryDto } from "@/utils/types";
import { ChevronRight } from "lucide-react";
import styles from "./Categories.module.css";

type Props = {
  active: string | null;
  onSelect: (categoryId: string | null) => void;
};

export default function Categories({ active, onSelect }: Props) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<CategoryDto[]>("/Categories");
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.categories}>
        <div className={styles.loading}>Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className={styles.categoriesSection}>
      <div className={styles.categoriesContainer}>
        <div className={styles.categoriesHeader}>
          <h2>Категории</h2>
        </div>
        <div className={styles.categories}>
          <button
            className={`${styles.categoryButton} ${active === null ? styles.active : ""}`}
            onClick={() => onSelect(null)}
          >
            <span>Все товары</span>
            <ChevronRight size={18} />
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${active === category.id ? styles.active : ""}`}
              onClick={() => onSelect(active === category.id ? null : category.id)}
            >
              <span>{category.name}</span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
