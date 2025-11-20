"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import styles from "../login/auth.module.css";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    match: false,
  });

  const { login } = useAuth();

  const validatePassword = (pwd: string, cfm: string) => {
    setValidations({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      match: pwd === cfm && pwd.length > 0,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    validatePassword(pwd, confirm);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cfm = e.target.value;
    setConfirm(cfm);
    validatePassword(password, cfm);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!validations.length || !validations.uppercase || !validations.number || !validations.match) {
      toast.error("Пожалуйста, проверьте требования к паролю");
      return;
    }

    setLoading(true);
    try {
      const regRes = await fetch("http://localhost:5200/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!regRes.ok) {
        const txt = await regRes.text().catch(() => "");
        throw new Error(txt || "Ошибка при регистрации");
      }

      const loginRes = await fetch("http://localhost:5200/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        toast.success("Регистрация успешна! Пожалуйста, выполните вход.");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      const user = await getCurrentUser();
      if (user) {
        login(user);
      }

      toast.success("Добро пожаловать! Перенаправление на профиль...");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: any) {
      toast.error(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        {/* Brand Side */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <div className={styles.logo}>🛒</div>
            <h1>OnlineStore</h1>
            <p>Присоединитесь к нам и наслаждайтесь лучшими товарами</p>
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Создайте учетную запись за 2 минуты</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Сохраняйте избранные товары</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>Отслеживайте ваши заказы</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>Создать аккаунт</h2>
              <p>Заполните форму ниже</p>
            </div>

            <form onSubmit={handleRegister} className={styles.form}>
              {/* Username */}
              <div className={styles.formGroup}>
                <label htmlFor="username">Имя пользователя</label>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.icon} />
                  <input
                    id="username"
                    type="text"
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email */}
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
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.icon} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <RequirementItem met={validations.length} label="Минимум 8 символов" />
                  <RequirementItem met={validations.uppercase} label="Хотя бы одна заглавная буква" />
                  <RequirementItem met={validations.number} label="Хотя бы одна цифра" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirm">Подтвердить пароль</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.icon} />
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={handleConfirmChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <RequirementItem met={validations.match} label="Пароли совпадают" />
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitBtn} disabled={loading || !Object.values(validations).every(v => v)}>
                {loading ? (
                  <span className={styles.loading} />
                ) : (
                  <>
                    <span>Создать аккаунт</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className={styles.signUpLink}>
              <p>Уже есть аккаунт? <Link href="/login">Войти</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
      <CheckCircle
        size={16}
        style={{
          color: met ? "var(--success-color)" : "var(--border-color)",
          flexShrink: 0,
        }}
        fill={met ? "currentColor" : "none"}
      />
      <span style={{ color: met ? "var(--success-color)" : "var(--text-light)" }}>{label}</span>
    </div>
  );
}
