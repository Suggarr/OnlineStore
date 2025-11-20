"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/utils/auth";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { User, Mail, Package, Heart, Settings, LogOut, Edit2, Lock, X } from "lucide-react";
import Link from "next/link";
import styles from "./profile.module.css";
import { toast } from "react-toastify";
import { useLocale } from "@/contexts/LocaleContext";

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
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const { t } = useLocale();

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
  const [loading, setLoading] = useState(true);

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
        if (user) {
          setEditUsername(user.username);
          setEditEmail(user.email);

          const ordersRes = await apiClient.get<OrderData[]>("/Orders");
          setOrders((ordersRes.data as OrderData[]) || []);

          const favRes = await apiClient.get<FavoriteData[]>("/Favorites");
          setFavorites((favRes.data as FavoriteData[]) || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileSave = async () => {
    if (!user) return;
    try {
      const updatedUser = await updateUserProfile({ username: editUsername, email: editEmail });
      if (updatedUser) {
        login(updatedUser);
      }
      setIsEditModalOpen(false);
      toast.success(t("profile.messages.profileUpdated", "Профиль успешно обновлён"));
    } catch (err) {
      console.error(err);
      toast.error(t("profile.messages.updateError", "Ошибка обновления профиля"));
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t("profile.messages.fillAllFields", "Заполните все поля"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("profile.messages.passwordsMismatch", "Пароли не совпадают"));
      return;
    }

    try {
      await apiClient.patch("/users/infome/password", { oldPassword, newPassword });
      toast.success(t("profile.messages.passwordChanged", "Пароль успешно изменён"));
      setIsPasswordModalOpen(false);
      setTimeout(() => handleLogout(), 1000);
    } catch (err) {
      console.error(err);
      toast.error(t("profile.messages.passwordError", "Ошибка при смене пароля"));
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.notAuthorized}>
          <h2>{t("profile.notAuthorized.title", "Вы не авторизованы")}</h2>
          <p>{t("profile.notAuthorized.text", "Пожалуйста, войдите в аккаунт")}</p>
          <Link href="/login" className={styles.loginLink}>
            {t("profile.notAuthorized.linkText", "Перейти на вход")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatar}>
            <User size={40} />
          </div>
          <div className={styles.userInfo}>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <button className={styles.editProfileBtn} onClick={() => setIsEditModalOpen(true)}>
              <Edit2 size={18} />
              {t("profile.header.editBtn", "Отредактировать")}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "orders" ? styles.active : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <Package size={20} />
          <span>{t("profile.tabs.orders", "Мои заказы")}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === "favorites" ? styles.active : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          <Heart size={20} />
          <span>{t("profile.tabs.favorites", "Избранное")}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === "settings" ? styles.active : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={20} />
          <span>{t("profile.tabs.settings", "Настройки")}</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Orders */}
        {activeTab === "orders" && (
          <div className={styles.section}>
            {loading ? (
              <div className={styles.loading}>{t("profile.orders.loading", "Гружка...")}</div>
            ) : orders.length === 0 ? (
              <div className={styles.empty}>
                <Package size={48} />
                <h3>{t("profile.orders.emptyTitle", "Нет заказов")}</h3>
                <p>{t("profile.orders.emptyText", "Вы еще не сделали ни одного заказа")}</p>
                <Link href="/catalog" className={styles.actionBtn}>
                  {t("profile.orders.catalogLink", "Перейти в каталог")}
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderId}>{t("profile.orders.orderLabel", "Заказ")} #{order.id.slice(0, 8)}</span>
                      <span className={styles.orderDate}>{formatDateTime(order.createdAt)}</span>
                    </div>
                    <div className={styles.orderItems}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          {item.imageUrl && <img src={item.imageUrl} alt={item.productName} />}
                          <div className={styles.itemInfo}>
                            <p className={styles.itemName}>{item.productName}</p>
                            <p className={styles.itemPrice}>
                              {item.quantity} {t("profile.orders.times", "×")} {item.price.toLocaleString("ru-RU")} $
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === "favorites" && (
          <div className={styles.section}>
            {loading ? (
              <div className={styles.loading}>{t("profile.favorites.loading", "Гружка...")}</div>
            ) : favorites.length === 0 ? (
              <div className={styles.empty}>
                <Heart size={48} />
                <h3>{t("profile.favorites.emptyTitle", "Избранное пусто")}</h3>
                <p>{t("profile.favorites.emptyText", "Добавьте товары в избранное, чтобы позже легко их найти")}</p>
                <Link href="/catalog" className={styles.actionBtn}>
                  {t("profile.favorites.catalogLink", "Перейти в каталог")}
                </Link>
              </div>
            ) : (
              <div className={styles.favoritesList}>
                {favorites.map((fav) => (
                  <div key={fav.id} className={styles.favoriteCard}>
                    <img src={fav.product.imageUrl} alt={fav.product.name} />
                    <div className={styles.favInfo}>
                      <h4>{fav.product.name}</h4>
                      <p>{fav.product.description}</p>
                      <span className={styles.favPrice}>
                        {fav.product.price.toLocaleString("ru-RU")} $
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className={styles.section}>
            <div className={styles.settingsCard}>
              <h3>{t("profile.settings.title", "Настройка аккаунта")}</h3>

              <div className={styles.settingItem}>
                <Mail size={20} />
                <div>
                  <label>Email:</label>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <User size={20} />
                <div>
                  <label>{t("profile.settings.role", "Роль")}:</label>
                  <p>{user.role}</p>
                </div>
              </div>

              <div className={styles.settingsActions}>
                <button className={styles.btn} onClick={() => setIsEditModalOpen(true)}>
                  <Edit2 size={18} />
                  {t("profile.settings.editBtn", "Редактировать профиль")}
                </button>
                <button className={styles.btnWarning} onClick={() => setIsPasswordModalOpen(true)}>
                  <Lock size={18} />
                  {t("profile.settings.passwordBtn", "Сменить пароль")}
                </button>
                <button className={styles.btnDanger} onClick={handleLogout}>
                  <LogOut size={18} />
                  {t("profile.settings.logoutBtn", "Выйти из аккаунта")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t("profile.modals.editTitle", "Отредактировать профиль")}</h3>
              <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("profile.modals.usernameLabel", "Имя пользователя")}</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder={t("profile.modals.usernamePlaceholder", "Введите имя")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder={t("profile.modals.emailPlaceholder", "Введите email")}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.btnSecondary} onClick={() => setIsEditModalOpen(false)}>
                  {t("profile.modals.cancelBtn", "Отмена")}
                </button>
                <button className={styles.btnPrimary} onClick={handleProfileSave}>
                  {t("profile.modals.saveBtn", "Сохранить изменения")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPasswordModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t("profile.modals.passwordTitle", "Смена пароля")}</h3>
              <button className={styles.closeBtn} onClick={() => setIsPasswordModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>{t("profile.modals.currentPasswordLabel", "Текущий пароль")}</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("profile.modals.newPasswordLabel", "Новый пароль")}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("profile.modals.confirmPasswordLabel", "Подтвердить пароль")}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.btnSecondary} onClick={() => setIsPasswordModalOpen(false)}>
                  {t("profile.modals.cancelBtn", "Отмена")}
                </button>
                <button className={styles.btnPrimary} onClick={handlePasswordChange}>
                  {t("profile.modals.changePasswordBtn", "Изменить пароль")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
