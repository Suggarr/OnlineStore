"use client";

import { Smile } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import styles from "./overview.module.css";

export default function AdminOverview() {
  const { t } = useLocale();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Smile size={80} className={styles.emptyIcon} />
          <h1 className={styles.title}>
            {t("admin.overview.welcomeTitle", "Добро пожаловать в админку!")}
          </h1>
          <p className={styles.subtitle}>
            {t(
              "admin.overview.welcomeText",
              "Здесь вы можете управлять магазином и всеми его функциями."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
