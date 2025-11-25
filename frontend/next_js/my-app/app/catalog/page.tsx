"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { CategoryDto, ProductDto } from "@/utils/types";
import { ArrowRight, Filter, Heart } from "lucide-react";
import Link from "next/link";
import styles from "./catalog.module.css";
import { toast } from "react-toastify";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CatalogPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes, favoritesRes] = await Promise.all([
          apiClient.get<CategoryDto[]>("/Categories"),
          apiClient.get<ProductDto[]>("/Products"),
          user ? apiClient.get<any[]>("/Favorites") : Promise.resolve({ data: [] }),
        ]);

        if (categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (productsRes.data) {
          setAllProducts(productsRes.data);
          setFilteredProducts(productsRes.data);
        }
        if (favoritesRes.data && Array.isArray(favoritesRes.data)) {
          const favIds = new Set(favoritesRes.data.map((fav: any) => fav.product.id));
          setFavorites(favIds);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast.error(t("catalog.errors.loadFailed", "Не удалось загрузить данные каталога"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse();
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, allProducts]);

  const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    const newFavorites = new Set(favorites);
    const wasInFavorites = newFavorites.has(productId);
    
    try {
      await apiClient.post(`/Favorites/${productId}/toggle`, {});
      
      if (wasInFavorites) {
        newFavorites.delete(productId);
        toast.success(t("catalog.favorites.removed", "Товар удален из избранного"));
      } else {
        newFavorites.add(productId);
        toast.success(t("catalog.favorites.added", "Товар добавлен в избранное"));
      }
      
      setFavorites(newFavorites);
    } catch (error) {
      toast.error(t("catalog.favorites.error", "Ошибка при изменении избранного"));
    }
  };

  return (
    <div className={styles.catalogContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>{t("catalog.title", "Каталог товаров")}</h1>
        <p>{t("catalog.subtitle", "Найдите лучшие товары в нашем магазине")}</p>
      </div>

      <div className={styles.mainContent}>
        {/* Sidebar with Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <h3>
              <Filter size={20} />
              {t("catalog.filters.title", "Фильтры")}
            </h3>

            {/* Search in sidebar */}
            <div className={styles.filterGroup}>
              <label htmlFor="search">{t("catalog.filters.search", "Поиск")}</label>
              <input
                id="search"
                type="text"
                placeholder={t("catalog.filters.searchPlaceholder", "Введите название...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label>{t("catalog.filters.category", "Категория")}</label>
              <button
                className={`${styles.categoryFilter} ${selectedCategory === null ? styles.active : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                {t("catalog.filters.allCategories", "Все категории")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryFilter} ${selectedCategory === cat.id ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className={styles.filterGroup}>
              <label htmlFor="sort">{t("catalog.filters.sort", "Сортировка")}</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.selectInput}
              >
                <option value="popular">{t("catalog.sortOptions.popular", "По популярности")}</option>
                <option value="price-asc">{t("catalog.sortOptions.priceLowToHigh", "Цена: от низкой к высокой")}</option>
                <option value="price-desc">{t("catalog.sortOptions.priceHighToLow", "Цена: от высокой к низкой")}</option>
                <option value="newest">{t("catalog.sortOptions.newest", "Новые товары")}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className={styles.productsSection}>
          {/* Results Info */}
          <div className={styles.resultsInfo}>
            <p>
              {t("catalog.results.found", "Найдено товаров")}: <strong>{filteredProducts.length}</strong>
            </p>
            {selectedCategory && (
              <button
                className={styles.clearFilter}
                onClick={() => setSelectedCategory(null)}
              >
                {t("catalog.results.clearFilter", "Очистить фильтр")}
              </button>
            )}
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <Link href={`/products/${product.id}`}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <button
                        className={`${styles.favoriteBtn} ${favorites.has(product.id) ? styles.active : ""}`}
                        onClick={(e) => toggleFavorite(e, product.id)}
                        type="button"
                        aria-label={t("catalog.favorites.addToFavorites", "Добавить в избранное")}
                      >
                        <Heart size={20} fill={favorites.has(product.id) ? "currentColor" : "none"} />
                      </button>
                      <div className={styles.categoryBadge}>
                        {product.categoryName || "Товар"}
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <h3>{product.name}</h3>
                      <p className={styles.description}>{product.description}</p>
                      <div className={styles.footer}>
                        <span className={styles.price}>
                          {product.price.toLocaleString("ru-RU")} $
                        </span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>{t("catalog.empty.title", "Товары не найдены")}</h3>
              <p>{t("catalog.empty.description", "Попробуйте изменить параметры поиска или фильтры")}</p>
            </div>
          )}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className={styles.authModalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.authModalHeader}>
              <h2>{t("catalog.authModal.title", "Требуется авторизация")}</h2>
            </div>
            <div className={styles.authModalBody}>
              <p>{t("catalog.authModal.message", "Пожалуйста, войдите в аккаунт, чтобы добавлять товары в избранное и совершать покупки")}</p>
            </div>
            <div className={styles.authModalActions}>
              <button className={styles.authModalCancel} onClick={() => setShowAuthModal(false)}>
                {t("catalog.authModal.cancelBtn", "Закрыть")}
              </button>
              <button className={styles.authModalLogin} onClick={() => router.push("/login")}>
                {t("catalog.authModal.loginBtn", "Перейти на вход")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
