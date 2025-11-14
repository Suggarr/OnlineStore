"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LucideHeart } from 'lucide-react';
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
  const router = useRouter();
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
        const favRes = await fetch(`http://localhost:5200/api/Favorites/contains/${id}`, {
          credentials: "include",
        });
        if (favRes.ok) {
          const isFavorite = await favRes.json();
          setIsFavorite(Boolean(isFavorite));
        } else {
          // если неавторизован или ошибка — считаем не в избранном
          setIsFavorite(false);
        }
        const cartRes = await fetch(`http://localhost:5200/api/CartItems/contains/${id}`, {
          credentials: "include",
        });
        if (cartRes.ok) {
          const isInCart = await cartRes.json();
          setAddedToCart(Boolean(isInCart));
        } else {
          setAddedToCart(false);
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
      if (!addedToCart) {
        const res = await fetch("http://localhost:5200/api/CartItems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        if (!res.ok) throw new Error("Ошибка при добавлении в корзину");
        setAddedToCart(true);
      } 
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
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
            <LucideHeart
              color={isFavorite ? "#e0245e" : "#888888"}
              fill={isFavorite ? "#e0245e" : "#888888"}
            />
          </button>
        </div>

        <p className="category">{product.categoryName}</p>

        <p className="description">{product.description}</p>

        <div className="purchase-row">
          <p className="price">{product.price.toFixed(2)} $</p>
          <div className="buttons-row">
            <button
              className={`add-to-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? "Добавлено" : "Добавить в корзину"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
