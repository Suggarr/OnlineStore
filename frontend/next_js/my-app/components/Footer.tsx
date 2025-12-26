"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import styles from "./Footer.module.css";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>{t("footer.brand", "OnlineStore")}</h4>
            <p>{t("footer.tagline", "Ваш надежный интернет-магазин электроники с лучшими ценами и широким ассортиментом товаров.")}</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.navigationTitle", "Навигация")}</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/">{t("header.nav.home", "Главная")}</Link>
              </li>
              <li>
                <Link href="/catalog">{t("header.nav.catalog", "Каталог")}</Link>
              </li>
              <li>
                <Link href="/about">{t("footer.about", "О магазине")}</Link>
              </li>
              <li>
                <Link href="/contacts">{t("footer.contacts", "Контакты")}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.supportTitle", "Поддержка")}</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/faq">{t("footer.faq", "Часто задаваемые вопросы")}</Link>
              </li>
              <li>
                <Link href="/returns">{t("footer.returns", "Возвраты и обмены")}</Link>
              </li>
              <li>
                <Link href="/shipping">{t("footer.shipping", "Доставка")}</Link>
              </li>
              <li>
                <Link href="/warranty">{t("footer.warranty", "Гарантия")}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.contactTitle", "Контакты")}</h4>
            <div className={styles.contactItem}>
              <Phone size={18} />
              <a href="tel:+37517257209">+375 17 257-20-95</a>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} />
              <a href="mailto:gogle35673@gmail.com">gogle35673@gmail.com</a>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={18} />
              <span>{t("footer.address", "г. Минск, ул. Панченко, д. 50")}</span>
            </div>
            <div className={styles.contactItem}>
              <Linkedin size={18} />
              <a href="https://www.linkedin.com/in/ilya-sakharevich-123587377" target="_blank" rel="noopener noreferrer">{t("footer.linkedin", "LinkedIn Profile")}</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 {t("footer.brand", "OnlineStore")} — {t("footer.rights", "Все права защищены.")}</p>
          <div className={styles.links}>
            <Link href="/privacy">{t("footer.privacy", "Политика конфиденциальности")}</Link>
            <span>|</span>
            <Link href="/terms">{t("footer.terms", "Условия использования")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}