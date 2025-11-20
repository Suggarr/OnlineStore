"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "./auth.module.css";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

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
        const text = await res.text();
        throw new Error(text || "Ошибка входа");
      }

      const user = await getCurrentUser();
      if (user) {
        login(user);
      }

      toast.success("✅ Успешный вход!");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: any) {
      toast.error(err.message);
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
            <p>Ваш надежный интернет-магазин электроники</p>
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Быстрая доставка</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Лучшие цены</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>Вход в аккаунт</h2>
              <p>Введите ваши учетные данные</p>
            </div>

            <form onSubmit={handleLogin} className={styles.form}>
              {/* Email Input */}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <Mail size={20} className={styles.icon} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
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

              {/* Remember & Forgot */}
              <div className={styles.formOptions}>
                <label>
                  <input type="checkbox" />
                  <span>Запомнить меня</span>
                </label>
                <Link href="#" className={styles.forgotLink}>
                  Забыли пароль?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span className={styles.loading} />
                ) : (
                  <>
                    <span>Войти</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className={styles.signUpLink}>
              <p>Нет аккаунта? <Link href="/register">Зарегистрироваться</Link></p>
            </div>

            {/* Divider */}
            <div className={styles.divider}>
              <span>или</span>
            </div>

            {/* Social Login */}
            <div className={styles.socialLogin}>
              <button type="button" className={styles.socialBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
