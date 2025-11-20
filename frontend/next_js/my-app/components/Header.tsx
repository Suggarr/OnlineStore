// components/Header.tsx
"use client";

import { useState } from "react";
import { User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  const navItems = [
    { label: t("header.nav.home", "Главная"), href: "/" },
    { label: t("header.nav.catalog", "Каталог"), href: "/catalog" },
  ];

  const menuLinks = [
    ...navItems,
    ...(user && (user.role === "Admin" || user.role === "SuperAdmin")
      ? [{ label: t("header.nav.admin", "Админка"), href: "/admin" }]
      : []),
    ...(user
      ? [{ label: `${t("header.profile", "Профиль")} (${user.username})`, href: "/profile" }]
      : []),
  ];

  return (
    <>
      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>
          🛒 OnlineStore
        </div>

        <nav className="menu">
          {menuLinks.map((item, idx) => (
            <a key={idx} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="actions">
          {/* Корзина - видна только на десктопе */}
          <a href="/cart" className="cart-link">
            <ShoppingCart size={20} />
          </a>

          {/* Переключатель языка */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="lang-select"
            aria-label={t("header.langSelectAria", "Select language")}
            style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }}
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>

          {/* Кнопка входа/выхода - видна только на десктопе */}
          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              {t("header.logout", "Выйти")}
            </button>
          ) : (
            <a href="/login" className="login-link">
              <User size={20} />
              {t("header.login", "Войти")}
            </a>
          )}

          {/* Бургер-меню - видно только на мобильных */}
          <button
            className={`menu-burger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
          </button>
        </div>

        {/* Мобильное меню */}
        <div className={`header-menu ${menuOpen ? "active" : ""}`}>
          <nav>
            {menuLinks.map((item, idx) => (
              <a
                key={"mobile_" + idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {/* КОРЗИНА в мобильном меню */}
            <a
              href="/cart"
              className="mobile-cart"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart size={18} />
              {t("header.cart", "Корзина")}
            </a>

            {/* КНОПКА ВХОДА/ВЫХОДА в мобильном меню */}
            {user ? (
              <button onClick={handleLogout} className="mobile-logout">
                {t("header.logout", "Выйти")}
              </button>
            ) : (
              <a 
                href="/login" 
                className="mobile-login"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                {t("header.login", "Войти")}
              </a>
            )}
          </nav>
        </div>

        <div
          className={`overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>
      </header>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .logo {
          font-weight: 700;
          font-size: 1.4rem;
          color: royalblue;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .menu {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: 0.2s;
        }

        .nav-link:hover {
          color: royalblue;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Стили для десктопной версии */
        .cart-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #333;
          transition: 0.2s;
        }

        .cart-link:hover {
          color: royalblue;
        }

        .login-link {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: 0.2s;
        }

        .login-link:hover {
          color: royalblue;
        }

        .logout-btn {
          background: #ef4444;
          border: none;
          color: white;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        /* Бургер меню */
        .menu-burger {
          display: none;
          background-color: transparent;
          width: 40px;
          height: 40px;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 1100;
        }

        .menu-burger span,
        .menu-burger span::before,
        .menu-burger span::after {
          display: block;
          width: 28px;
          height: 3px;
          background-color: royalblue;
          position: relative;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .menu-burger span::before,
        .menu-burger span::after {
          content: "";
          position: absolute;
          left: 0;
        }

        .menu-burger span::before {
          top: -8px;
        }

        .menu-burger span::after {
          bottom: -8px;
        }

        .menu-burger.active span {
          background: transparent;
        }

        .menu-burger.active span::before {
          transform: rotate(45deg);
          top: 0;
          background: white;
        }

        .menu-burger.active span::after {
          transform: rotate(-45deg);
          bottom: 0;
          background: white;
        }

        .header-menu {
          display: none;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 768px) {
          /* Скрываем десктопные элементы на мобильных */
          .cart-link,
          .login-link,
          .logout-btn {
            display: none;
          }

          .menu {
            display: none;
          }

          .menu-burger {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .header-menu {
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100vh;
            background-color: royalblue;
            flex-direction: column;
            padding-top: 80px;
            padding-left: 20px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }

          .header-menu.active {
            transform: translateX(0);
          }

          .header-menu nav a {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 10px;
            margin: 8px 0;
            font-size: 18px;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
          }

          .header-menu nav a:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          /* Стили для мобильной корзины */
          .mobile-cart {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          /* Стили для мобильной авторизации */
          .mobile-logout {
            background: #ef4444;
            border: none;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
            transition: 0.2s;
          }

          .mobile-logout:hover {
            background: #dc2626;
          }

          .mobile-login {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            color: white;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            transition: background 0.3s;
            margin-top: 10px;
          }

          .mobile-login:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          .overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            z-index: 900;
          }

          .overlay.active {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </>
  );
}