"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { ProductDto } from "@/utils/types";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import styles from "./Products.module.css";
import { toast } from "react-toastify";

type Props = {
  search: string;
  category: string | null;
};

export default function Products({ search, category }: Props) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let productsRes;
        
        // Получить товары из API
        if (category) {
          productsRes = await apiClient.get<ProductDto[]>(`/Products/by-categoryId/${category}`);
        } else {
          productsRes = await apiClient.get<ProductDto[]>("/Products");
        }
        
        let products = productsRes.data || [];
        
        // Применить фильтр поиска клиент-сайд если нужно
        if (search) {
          products = products.filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        setProducts(products);
        
        // Получить избранные товары
        const favoritesRes = await apiClient.get<any[]>("/Favorites");
        if (favoritesRes.data && Array.isArray(favoritesRes.data)) {
          const favIds = new Set(favoritesRes.data.map((fav: any) => fav.product.id));
          setFavorites(favIds);
        }
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        toast.error("Не удалось загрузить товары");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category]);

  const toggleFavorite = async (productId: string) => {
    try {
      await apiClient.post(`/Favorites/${productId}/toggle`, {});
      
      const newFavorites = new Set(favorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast.success("Товар удален из избранного");
      } else {
        newFavorites.add(productId);
        toast.success("Товар добавлен в избранное");
      }
      setFavorites(newFavorites);
    } catch (error) {
      toast.error("Ошибка при изменении избранного");
    }
  };

  const handleAddToCart = async (product: ProductDto) => {
    try {
      await apiClient.post("/CartItems", {
        productId: product.id,
        quantity: 1,
      });
      toast.success(`${product.name} добавлен в корзину`);
      router.push("/cart");
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      toast.error("Не удалось добавить товар в корзину");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingGrid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Товары</h2>
        <p className={styles.count}>Найдено товаров: {products.length}</p>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <Link href={`/products/${product.id}`}>
              <div className={styles.imageWrapper}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={styles.image}
                />
                <div className={styles.badge}>
                  <span>{product.categoryName || "Товар"}</span>
                </div>
              </div>
            </Link>

            <div className={styles.cardContent}>
              <Link href={`/products/${product.id}`}>
                <h3 className={styles.title}>{product.name}</h3>
              </Link>
              <p className={styles.description}>{product.description}</p>

              <div className={styles.footer}>
                <div className={styles.price}>
                  <span className={styles.priceValue}>{product.price.toLocaleString("ru-RU")} ₽</span>
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.favoriteBtn} ${favorites.has(product.id) ? styles.active : ""}`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Добавить в избранное"
                  >
                    <Heart size={20} fill={favorites.has(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className={styles.cartBtn}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={20} />
                    <span>В корзину</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
