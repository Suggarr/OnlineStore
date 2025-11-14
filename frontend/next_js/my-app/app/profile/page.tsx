"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/utils/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useNotify } from "@/hooks/useNotify";

// Ваши типы остаются такими же...
type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

type OrderItem = {
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type OrderData = {
  id: string;
  createdAt: string;
  items: OrderItem[];
};

type FavoriteData = {
  id: string;
  product: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
};

export default function ProfilePage() {
  const notify = useNotify();
  const router = useRouter();
  const { user, logout, login } = useAuth(); // Добавляем login из контекста

  // Удаляем локальное состояние пользователя
  // const [user, setUser] = useState<UserData | null>(null);

  const [activeTab, setActiveTab] = useState("orders");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [favorites, setFavorites] = useState<FavoriteData[]>([]);

  // Сокращение текста
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Пользователь уже загружен через контекст, загружаем только дополнительные данные
        if (user) {
          setEditUsername(user.username);
          setEditEmail(user.email);

          // Получаем реальные заказы
          const ordersRes = await fetch("http://localhost:5200/api/Orders", { credentials: "include" });
          const ordersData = await ordersRes.json();
          setOrders(ordersData);

          // Получаем избранное
          const favRes = await fetch("http://localhost:5200/api/Favorites", { credentials: "include" });
          const favData = await favRes.json();
          setFavorites(favData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user]); // Зависимость от user

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileSave = async () => {
    if (!user) return;
    try {
      const updatedUser = await updateUserProfile({ username: editUsername, email: editEmail });
      if (updatedUser) {
        login(updatedUser); // Обновляем контекст вместо локального состояния
      }
      setIsEditModalOpen(false);
      notify.success("Профиль успешно обновлён");
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления профиля.");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return alert("Заполните все поля");
    if (newPassword !== confirmPassword) return alert("Пароли не совпадают");

    const res = await fetch("http://localhost:5200/api/users/infome/password", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (res.ok) {
      notify.success("Пароль успешно изменён");
      handleLogout();
    } else if (res.status === 409) {
      alert("Старый пароль введён неверно.");
    } else {
      alert("Ошибка при смене пароля.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://i.pravatar.cc/120" alt="avatar" />
        </div>
        <div className="profile-info">
          <h2>{user?.username || "Гость"}</h2>
          <p>{user?.email || "Не вошли в аккаунт"}</p>
          {user && (
            <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>Редактировать</button>
          )}
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Мои заказы</button>
        <button className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>Избранное</button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Настройки</button>
      </div>

      <div className="tab-content">
        {/* Заказы */}
        {activeTab === "orders" && (
          <div className="orders-list">
            {orders.length === 0 ? <p>У вас пока нет заказов</p> :
              orders.map(order => (
                <div key={order.id} className="order-card">
                  <p><strong>Заказ №{order.id}</strong> - {formatDateTime(order.createdAt)}</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img src={item.imageUrl || ""} alt={item.productName} />
                      <div>
                        <p>{item.productName}</p>
                        <p>{item.quantity} × {item.price.toFixed(2)} $</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        )}

        {/* Избранное */}
        {activeTab === "favorites" && (
          <div className="favorites-list">
            {favorites.length === 0 ? <p>У вас пока нет избранного</p> :
              favorites.map(fav => (
                <div key={fav.id} className="favorite-item">
                  <img src={fav.product.imageUrl} alt={fav.product.name} />
                  <div>
                    <p className="product-name">{fav.product.name}</p>
                    <p className="product-desc">{truncateText(fav.product.description, 100)}</p>
                    <span>{fav.product.price.toFixed(2)} $</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* Настройки */}
        {activeTab === "settings" && user && (
          <div className="settings">
            <h3>Настройка аккаунта</h3>
            <p>Дата регистрации: <strong>{formatDateTime(user.createdAt)}</strong></p>
            <div className="settings-buttons">
              <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>Редактировать профиль</button>
              <button className="password-btn" onClick={() => setIsPasswordModalOpen(true)}>Сменить пароль</button>
              <button className="logoutButton" onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
          </div>
        )}
      </div>

      {/* Модалка редактирования профиля */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Редактировать профиль</h3>
            <input type="text" placeholder="Имя" value={editUsername} onChange={e => setEditUsername(e.target.value)} />
            <input type="email" placeholder="Email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Отмена</button>
              <button className="save-btn" onClick={handleProfileSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка смены пароля */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Смена пароля</h3>
            <input type="password" placeholder="Старый пароль" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            <input type="password" placeholder="Новый пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Подтвердите новый пароль" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsPasswordModalOpen(false)}>Отмена</button>
              <button className="save-btn" onClick={handlePasswordChange}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-page {
          max-width: 950px;
          margin: 50px auto;
          background: #fff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          font-family: "Segoe UI", sans-serif;
        }
        .profile-header { display: flex; align-items: center; gap: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .profile-avatar img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
        .profile-info h2 { margin: 0; font-size: 26px; }
        .profile-info p { color: #555; margin-top: 4px; }

        .edit-btn { background: #2563eb; color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; margin-top: 10px; transition: 0.3s; }
        .edit-btn:hover { background: #1d4ed8; }

        .tabs { display: flex; gap: 10px; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .tabs button { background: none; border: none; padding: 10px 20px; cursor: pointer; font-size: 16px; color: #555; border-radius: 8px; transition: 0.2s; }
        .tabs button.active { background: #2563eb; color: white; }

        .tab-content { margin-top: 30px; }
        .order-card, .favorite-item, .settings { background: #f9fafb; padding: 15px; border-radius: 12px; margin-bottom: 15px; }
        .statusDone { color: #16a34a; font-weight: bold; }
        .statusInProgress { color: #eab308; font-weight: bold; }

        .order-item, .favorite-item { display: flex; align-items: center; gap: 15px; margin-top: 10px; }
        .order-item img, .favorite-item img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }

        .product-name { font-weight: 600; margin-bottom: 4px; }
        .product-desc { font-size: 14px; color: #555; margin-bottom: 6px; }

        .password-btn, .logoutButton { margin-top: 10px; padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .password-btn { background: #f59e0b; color: white; }
        .password-btn:hover { background: #d97706; }
        .logoutButton { background: #ef4444; color: white; }
        .logoutButton:hover { background: #dc2626; }

        /* Модалка */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        /* только стили модалок и кнопок внутри модалки */
      .modal {
        background: white;
        padding: 25px;
        border-radius: 16px;
        width: 400px;
        max-width: 90%;
        animation: fadeIn 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 15px; /* расстояние между строками внутри модалки */
      }

      .modal input {
        width: 95%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
        margin: 0; /* убираем лишние внешние отступы */
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px; /* расстояние между кнопками */
        margin-top: 10px; /* отступ сверху, чтобы отделить кнопки от полей */
      }
      
      .modal-actions button{
       height: 42px;
  min-width: 120px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
      }
      /* Горизонтальные кнопки в настройках */
.settings-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.settings-buttons button {
  flex: none;
  padding: 10px 16px;
  height: 42px; /* 👈 фиксированная высота для всех */
  min-width: 120px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* одинаковый стиль, отличаются только цвета */
.settings-buttons .edit-btn {
  background: #2563eb;
  color: white;
}
.settings-buttons .edit-btn:hover {
  background: #1d4ed8;
}

.settings-buttons .password-btn {
  background: #f59e0b;
  color: white;
}
.settings-buttons .password-btn:hover {
  background: #d97706;
}

.settings-buttons .logoutButton {
  background: #ef4444;
  color: white;
}
.settings-buttons .logoutButton:hover {
  background: #dc2626;
}

      }
      .cancel-btn {
  background: #f3f4f6;
  color: #111;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cancel-btn:hover { background: #e5e7eb; }
.save-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.save-btn:hover { background: #1d4ed8; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
