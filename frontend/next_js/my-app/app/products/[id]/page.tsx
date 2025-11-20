"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { ProductDto } from "@/utils/types";
import Link from "next/link";
import { Heart, ShoppingCart, Share2, ChevronLeft, Star, Package, Truck, Shield } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import styles from "./product.module.css";
import { toast } from "react-toastify";

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductDto[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const [productRes, isFavRes] = await Promise.all([
          apiClient.get<ProductDto>(`/Products/${id}`),
          apiClient.get<boolean>(`/Favorites/contains/${id}`),
        ]);
        
        if (productRes.data) {
          setProduct(productRes.data);
          setIsFavorite(isFavRes.data || false);
          
          const relatedData = await apiClient.get<ProductDto[]>(
            `/Products/by-categoryId/${productRes.data.categoryId}`
          );
          if (relatedData.data) {
            setRelatedProducts(
              relatedData.data.filter((p) => p.id !== productRes.data?.id).slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        toast.error(t('product.errorLoad', 'Не удалось загрузить товар'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // Добавить в корзину через API (1 шт)
      await apiClient.post("/CartItems", {
        productId: product.id,
        quantity: 1,
      });
      
      toast.success(`${product.name} ${t('product.addedSuffix', 'добавлен в корзину')}`);
      
      // Перенаправить в корзину
      setTimeout(() => {
        router.push("/cart");
      }, 500);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      toast.error(t('product.addToCartFail', 'Не удалось добавить товар в корзину'));
    }
  };

  const toggleFavorite = async () => {
    try {
      await apiClient.post(`/Favorites/${product?.id}/toggle`, {});
      setIsFavorite(!isFavorite);
      toast.success(!isFavorite ? t('product.fav.added', 'Товар добавлен в избранное') : t('product.fav.removed', 'Товар удален из избранного'));
    } catch (error) {
      toast.error(t('product.fav.error', 'Ошибка при изменении избранного'));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      toast.info(t('product.share.copied', 'Ссылка скопирована в буфер обмена'));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
              <h2>{t('product.notFound', 'Товар не найден')}</h2>
              <Link href="/catalog" className={styles.backButton}>
                <ChevronLeft size={20} />
                {t('product.backToCatalog', 'Вернуться в каталог')}
              </Link>
            </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">{t('product.breadcrumb.home', 'Главная')}</Link>
        <span>/</span>
        <Link href="/catalog">{t('product.breadcrumb.catalog', 'Каталог')}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Back Button */}
      <Link href="/catalog" className={styles.backLink}>
        <ChevronLeft size={20} />
        {t('product.backLink', 'Назад в каталог')}
      </Link>

      {/* Main Product Section */}
      <div className={styles.mainGrid}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={product.imageUrl} alt={product.name} />
            <div className={styles.badge}>{product.categoryName}</div>
          </div>
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div>
              <h1>{product.name}</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < 4 ? "currentColor" : "none"}
                      color={i < 4 ? "var(--warning-color)" : "var(--border-color)"}
                    />
                  ))}
                </div>
                <span>(42 отзыва)</span>
              </div>
            </div>
            <button
              className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
              onClick={toggleFavorite}
            >
              <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Price Section */}
          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.mainPrice}>
                {product.price.toLocaleString("ru-RU")} $
              </span>
              <span className={styles.savings}>Экономия 20%</span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h3>{t('product.description.title', 'Описание')}</h3>
            <p>{product.description}</p>
          </div>

          {/* Purchase Section */}
          <div className={styles.purchaseSection}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <ShoppingCart size={20} />
              <span>{t('product.addToCart', 'В корзину')}</span>
            </button>

            <button className={styles.shareBtn} onClick={handleShare}>
              <Share2 size={20} />
              <span>{t('product.share', 'Поделиться')}</span>
            </button>
          </div>

          {/* Features */}
            <div className={styles.features}>
            <div className={styles.featureItem}>
              <Package size={20} />
              <div>
                <h4>{t('product.features.fastDelivery.title','Быстрая доставка')}</h4>
                <p>{t('product.features.fastDelivery.text','За 24-48 часов')}</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Truck size={20} />
              <div>
                <h4>{t('product.features.freeShipping.title','Бесплатная доставка')}</h4>
                <p>{t('product.features.freeShipping.text','При заказе от 100 $')}</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Shield size={20} />
              <div>
                <h4>{t('product.features.warranty.title','Гарантия')}</h4>
                <p>{t('product.features.warranty.text','2 года на товар')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <h2>{t('product.related.title','Похожие товары')}</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((prod) => (
              <Link key={prod.id} href={`/products/${prod.id}`} className={styles.relatedCard}>
                <div className={styles.relatedImage}>
                  <img src={prod.imageUrl} alt={prod.name} />
                </div>
                <h4>{prod.name}</h4>
                <p className={styles.relatedPrice}>{prod.price.toLocaleString("ru-RU")} $</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
