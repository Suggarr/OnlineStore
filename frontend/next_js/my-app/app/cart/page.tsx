"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import "./cart.css";

type CartItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { isAuthorized } = useAuthRedirect("http://localhost:5200/api/cartitems");

  async function fetchCart() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5200/api/cartitems", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Ошибка при загрузке корзины");
      const cartData: CartItem[] = await res.json();
      setCartItems(cartData);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить товары.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchCart();
    }
  }, [isAuthorized]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) {
      alert("Количество не может быть меньше 1.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5200/api/cartitems/${id}/quantity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: newQty }),
        }
      );
      if (!res.ok) throw new Error("Ошибка при обновлении количества");
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить количество товара.");
    }
  };

  const clearCart = async () => {
    if (!confirm("Вы уверены, что хотите очистить корзину?")) return;
    try {
      const res = await fetch(`http://localhost:5200/api/cartitems/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при очистке корзины");
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert("Не удалось очистить корзину.");
    }
  };
  // 🔹 Удалить один товар из корзины
  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар из корзины?")) return;

    try {
      const res = await fetch(`http://localhost:5200/api/cartitems/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Ошибка при удалении товара");

      // Удаляем товар из состояния без повторного запроса
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      alert("Товар удалён из корзины.");
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить товар из корзины.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Корзина пуста, добавить товары для оформления заказа!");
      return;
    }

    try {
      // Создаем заказ на сервере
      const res = await fetch(`http://localhost:5200/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Ошибка при оформлении заказа");

      // Очистка корзины после успешного оформления
      setCartItems([]);

      alert("Заказ успешно оформлен!");
      router.push("/"); // редирект на главную или страницу "Спасибо за заказ"
    } catch (err) {
      console.error(err);
      alert("Не удалось оформить заказ.");
    }
  };


  // 🔹 Переход на страницу товара
  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Корзина</h1>

      {loading ? (
        <p className="cart-loading">Загрузка...</p>
      ) : error ? (
        <p className="cart-error">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="cart-empty">У вас пока нет товаров в корзине.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((prod) => (
              <div
                key={prod.id}
                className={`cart-item ${hoveredId === prod.id ? "hovered" : ""
                  }`}
                onMouseEnter={() => setHoveredId(prod.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Фото кликабельно */}
                <img
                  src={prod.imageUrl}
                  alt={prod.productName}
                  className="cart-image clickable"
                  onClick={() => handleProductClick(prod.productId)}
                />

                <div className="cart-info">
                  <p
                    className="cart-name clickable"
                    onClick={() => handleProductClick(prod.productId)}
                  >
                    {prod.productName}
                  </p>

                  <p className="cart-price">{prod.price.toFixed(2)} $</p>

                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(prod.id, Math.max(prod.quantity - 1, 1))
                      }
                      disabled={prod.quantity <= 1} // минимальное значение 1
                    >
                      -
                    </button>

                    <span className="qty-display">{prod.quantity}</span>

                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(prod.id, prod.quantity + 1)}
                    >
                      +
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(prod.id)}>
                      Удалить товар
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <p className="cart-total">Итого: {totalPrice.toFixed(2)} $</p>

            <div className="cart-actions">
              <button className="checkout-btn" onClick={handleCheckout}>
                Оформить заказ
              </button>
              <button className="clear-btn" onClick={clearCart}>
                Очистить корзину
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
