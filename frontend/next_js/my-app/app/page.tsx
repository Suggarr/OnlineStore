"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { ProductDto } from "@/utils/types";
import Link from "next/link";
import { ArrowRight, Zap, Truck, ShieldCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import styles from "./page.module.css";

export default function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductDto[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await apiClient.get<ProductDto[]>("/Products");
        if (response.data) {
          setFeaturedProducts(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Ошибка загрузки избранных товаров:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t("home.hero.title", "Лучшие товары электроники по доступным ценам")}</h1>
          <p className={styles.heroSubtitle}>{t("home.hero.subtitle", "Откройте мир современной технологии с нашим магазином электроники")}</p>
          <Link href="/catalog" className={styles.heroButton}>
            <span>{t("home.hero.cta", "Перейти в каталог")}</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className={styles.heroBackground}></div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Zap size={32} />
            </div>
            <h3>{t("home.features.fastDelivery.title", "Быстрая доставка")}</h3>
            <p>{t("home.features.fastDelivery.text", "Доставляем заказы в течение 24-48 часов")}</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Truck size={32} />
            </div>
            <h3>{t("home.features.freeShipping.title", "Бесплатная доставка")}</h3>
            <p>{t("home.features.freeShipping.text", "При заказе от 100 $ доставка бесплатная")}</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={32} />
            </div>
            <h3>{t("home.features.quality.title", "Гарантия качества")}</h3>
            <p>{t("home.features.quality.text", "Все товары проверены и имеют гарантию")}</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loadingFeatured && featuredProducts.length > 0 && (
        <section className={styles.featured}>
          <div className={styles.featuredHeader}>
            <h2>{t("home.featured.title", "Рекомендуемые товары")}</h2>
            <Link href="/catalog" className={styles.seeAll}>
              {t("home.featured.seeAll", "Смотреть все")} <ArrowRight size={18} />
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className={styles.featuredCard}>
                <div className={styles.featuredImage}>
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <h3>{product.name}</h3>
                <p className={styles.featuredPrice}>{product.price.toLocaleString("ru-RU")} $</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
