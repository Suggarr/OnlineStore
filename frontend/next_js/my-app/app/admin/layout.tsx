"use client";

import "./admin.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "📊 Обзор" },
    { href: "/admin/users", label: "👤 Пользователи" },
    { href: "/admin/products", label: "🛍️ Товары" },
    { href: "/admin/categories", label: "🏷️ Категории" },
  ];

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <div className="admin-container">

      {/* Верхняя панель админки */}
      <div className="admin-topbar">
        <h1 className="admin-title">Панель администратора</h1>
        <button onClick={logout} className="admin-logout">Выйти</button>
      </div>

      {/* Навигация по вкладкам */}
      <nav className="admin-tabs">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`admin-tab ${pathname === tab.href ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Контент конкретной вкладки */}
      <div className="admin-content">
        {children}
      </div>

    </div>
  );
}
