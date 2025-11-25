"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Users, Package, Tag, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./admin.module.css";
import { useLocale } from "@/contexts/LocaleContext";
import { useAdminRedirect } from "@/hooks/useAdminRedirect";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useAdminRedirect();
  
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  const { user, loading } = useAuth();

  if (loading || !user) return null;
  
  const allTabs = [
    { href: "/admin", label: "Обзор", icon: BarChart3 },
    { href: "/admin/users", label: "Пользователи", icon: Users },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/categories", label: "Категории", icon: Tag },
  ];

  // Show Users tab only for SuperAdmin
  const tabs = allTabs.filter((t) => {
    if (t.href === "/admin/users") {
      return !!user && user.role === "SuperAdmin";
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>{t("admin.layout.title", "Панель администратора")}</h1>
        </div>

        {/* Navigation Tabs */}
        <nav className={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`${styles.tab} ${pathname === tab.href ? styles.active : ""}`}
              >
                <Icon size={18} />
                {tab.href === "/admin" && t("admin.layout.tabs.overview", "Обзор")}
                {tab.href === "/admin/users" && t("admin.layout.tabs.users", "Пользователи")}
                {tab.href === "/admin/products" && t("admin.layout.tabs.products", "Товары")}
                {tab.href === "/admin/categories" && t("admin.layout.tabs.categories", "Категории")}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
