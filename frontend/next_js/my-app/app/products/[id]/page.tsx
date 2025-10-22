"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./product.css";

interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
}

interface FavoriteDto {
  id: string;
  userId?: string;
  product?: {
    id: string;
    name?: string;
  };
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        // 1) Получаем товар
        const res = await fetch(`http://localhost:5200/api/Products/${id}`);
        if (!res.ok) throw new Error("Ошибка при загрузке товара");
        const prodData: ProductDto = await res.json();
        setProduct(prodData);

        // 2) Получаем избранное пользователя и смотрим, есть ли этот товар
        const favRes = await fetch("http://localhost:5200/api/Favorites", {
          credentials: "include",
        });
        if (favRes.ok) {
          const favs: FavoriteDto[] = await favRes.json();
          const found = favs.some(
            (f) =>
              (f.product && (f.product as any).id === prodData.id) ||
              // на случай другой структуры
              (f as any).productId === prodData.id ||
              (f as any).product?.id === prodData.id
          );
          setIsFavorite(found);
        } else {
          // если неавторизован или ошибка — считаем не в избранном
          setIsFavorite(false);
        }
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить товар.");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const res = await fetch("http://localhost:5200/api/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Ошибка при добавлении в корзину");
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      alert("Ошибка добавления в корзину.");
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!product) return;
    setFavLoading(true);

    // оптимистично переключаем состояние
    const prev = isFavorite;
    setIsFavorite(!prev);

    try {
      const res = await fetch(
        `http://localhost:5200/api/Favorites/${encodeURIComponent(product.id)}/toggle`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        // откатываем
        setIsFavorite(prev);
        // возможные статусы: 401/403/500
        if (res.status === 401) {
          alert("Нужно войти в аккаунт, чтобы управлять избранным.");
        } else {
          const msg = await res.text().catch(() => "");
          alert(msg || "Ошибка на сервере при изменении избранного.");
        }
      }
    } catch (err) {
      setIsFavorite(prev);
      console.error(err);
      alert("Ошибка сети — попробуйте снова.");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div className="product-loading">Загрузка...</div>;
  if (error) return <div className="product-error">{error}</div>;
  if (!product) return <div className="product-error">Товар не найден</div>;

  return (
    <div className="product-page">
      <div className="product-image">
        <img src={product.imageUrl || "/placeholder.png"} alt={product.name} />
      </div>

      <div className="product-info">
        <div className="info-top">
          <h1>{product.name}</h1>
          <button
            className={`favorite-btn ${isFavorite ? "fav" : ""}`}
            onClick={toggleFavorite}
            aria-pressed={isFavorite}
            title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            disabled={favLoading}
          >
            {/* простая икра SVG сердца */}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                d="M12 21s-7.5-4.93-10-8.01C-0.03 7.71 3.6 3 7.8 5.4 9.6 6.5 12 9 12 9s2.4-2.5 4.2-3.6C20.4 3 24.03 7.71 22 12.99 19.5 16.07 12 21 12 21z"
                fill={isFavorite ? "#ef4444" : "none"}
                stroke={isFavorite ? "transparent" : "#2563eb"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="visually-hidden">
              {isFavorite ? "В избранном" : "В избранное"}
            </span>
          </button>
        </div>

        <p className="category">{product.categoryName}</p>

        <p className="description">{product.description}</p>

        <div className="purchase-row">
          <p className="price">{product.price.toFixed(2)} ₽</p>
          <div className="buttons-row">
            <button
              className={`add-to-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? "Добавлено" : "Добавить в корзину"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
