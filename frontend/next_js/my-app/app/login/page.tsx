"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "./auth.module.css";
import { toast } from "react-toastify";
import { useLocale } from "@/contexts/LocaleContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5200/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // 401 - неверные учетные данные
        if (res.status === 401) {
          toast.error(t("login.messages.invalidCredentials"));
          setLoading(false);
          return;
        }
        const text = await res.text();
        throw new Error(text || "Ошибка входа");
      }

      const user = await getCurrentUser();
      if (user) login(user);

      toast.success(t("login.messages.success"));
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: any) {
      toast.error(t("login.messages.error") + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        {/* Left Side - Branding */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <div className={styles.logo}>🛒</div>
            <h1>OnlineStore</h1>
            <p>{t("login.tagline")}</p>
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t("login.benefits.delivery")}</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t("login.benefits.prices")}</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t("login.benefits.quality")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>{t("login.title")}</h2>
              <p>{t("login.subtitle")}</p>
            </div>

            <form onSubmit={handleLogin} className={styles.form}>
              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email">{t("login.email")}</label>
                <div className={styles.inputWrapper}>
                  <Mail size={20} className={styles.icon} />
                  <input
                    id="email"
                    type="text"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password">{t("login.password")}</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.icon} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loading} />
                ) : (
                  <>
                    <span>{t("login.submit")}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up */}
            <div className={styles.signUpLink}>
              <p>
                {t("login.noAccount")}{" "}
                <Link href="/register">{t("login.register")}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
