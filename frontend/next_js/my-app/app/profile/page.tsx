"use client";
import { useState } from "react";
import {products} from "@/components/Products";

export default function ProfilePage(){
  const [activeTab, setActiveTab] = useState("orders");
  const [name, setName] = useState("Иван Иванов");
  const [email, setEmail] = useState("ivan@example.com");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const favorites = [products[0], products[2]]; // пример — iPhone и LG TV

  return(
    
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://i.pravatar.cc/120" alt="avatar" />
        </div>
        <div className="profile-info">
          <h2>{name}</h2>
          <p>{email}</p>
          <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
            Редактировать
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === "orders" ? "active" : ""}
         onClick={() => setActiveTab("orders")}>
          Мои заказы
        </button>
        <button className={activeTab === "favorites" ? "active" : ""}
        onClick={() => setActiveTab("favorites")}>
          Избранное
        </button>
        <button className={activeTab === "settings" ? "active" : ""}
        onClick={() => setActiveTab("settings")}>
          Настройки
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "orders" && (
          <div className ="orders-list">
            <h3>Последние заказы</h3>
            <div className="order-card">
              <p><strong>Заказ №16739</strong> - iPhone 14 Pro </p>
              <p>Статус: <span className = "statusDone">Доставлен</span></p>
              <p>Дата: 02.09.2025</p>
            </div>
            <div className="order-card">
              <p><strong>Заказ №16739</strong> - MackBook Air M2</p>
              <p>Статус: <span className="statusInProgress">В пути</span></p>
              <p>Дата: 15.09.2025</p>
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="favorites-list">
            <h3>Избранные товары</h3>
            {favorites.map((p) => (
            <div key={p.id} className="favorite-item">
              <img src={p.img} alt={p.title} />
              <div>
                <p>{p.title}</p>
                <span>{p.price}</span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "settings" && (
        <div className="settings">
          <h3><strong>Настройка аккаунта</strong></h3>
          <p>Дата регистрации: <strong> 18.02.2024</strong></p>
          <p>Последний вход: <strong>10.10.2025</strong></p>
          <button className="logoutButton">Выйти из аккаунта</button>
        </div>
      )}

    {isModalOpen && (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>Редактировать профиль</h3>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Отмена</button>
            <button onClick={() => setIsModalOpen(false)} className="save-btn">Сохранить</button>
          </div>
        </div>
      </div>
    )}
    <style jsx>{`
      .profile-page {
        max-width: 900px;
        margin: 50px auto;
        background: #fff;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        font-family: "Segoe UI", sans-serif;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
      }

      .profile-avatar {
        position: relative;
      }

      .profile-avatar img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
      }

      .status-dot {
        position: absolute;
        bottom: 6px;
        right: 6px;
        width: 18px;
        height: 18px;
        background: #22c55e;
        border-radius: 50%;
        border: 3px solid white;
      }

      .profile-info h2 {
        margin: 0;
        font-size: 26px;
      }

      .profile-info p {
        color: #555;
        margin-top: 4px;
      }

      .edit-btn {
        background: #2563eb;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 10px;
        transition: 0.3s;
      }

      .edit-btn:hover {
        background: #1d4ed8;
      }

      .tabs {
        display: flex;
        gap: 10px;
        margin-top: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }

      .tabs button {
        background: none;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        color: #555;
        border-radius: 8px;
        transition: 0.2s;
      }

      .tabs button.active {
        background: #2563eb;
        color: white;
      }

      .tab-content {
        margin-top: 30px;
      }

      .order-card, .favorite-item, .settings {
        background: #f9fafb;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 15px;
      }

      .statusDone {
        color: #16a34a;
        font-weight: bold;
      }

      .statusInProgress {
        color: #eab308;
        font-weight: bold;
      }

      .favorite-item {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .favorite-item img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }

      .logoutButton {
        background: #ef4444;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.3s;
      }

      .logoutButton:hover {
        background: #dc2626;
      }

      /* Модалка */
      .modal-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background: white;
        padding: 25px;
        border-radius: 16px;
        width: 400px;
        animation: fadeIn 0.3s ease;
      }

      .modal input {
        width: 95%;
        padding: 10px;
        margin: 8px 0;
        border-radius: 10px;
        border: 1px solid #ccc;
        outline: none;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
      }

      .cancel-btn {
        background: #e5e7eb;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
      }

      .save-btn {
        background: #2563eb;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    </div>
  );
}