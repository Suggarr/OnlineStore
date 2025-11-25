"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import styles from "../login/auth.module.css";
import { toast } from "react-toastify";
import { useLocale } from "@/contexts/LocaleContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validations, setValidations] = useState({
    usernameLength: false,
    emailValid: false,
    length: false,
    match: false,
  });

  const { login } = useAuth();

  const validatePassword = (pwd: string, cfm: string) => {
    setValidations(prev => ({
      ...prev,
      length: pwd.length >= 8,
      match: pwd === cfm && pwd.length > 0,
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uname = e.target.value;
    setUsername(uname);
    setValidations(prev => ({
      ...prev,
      usernameLength: uname.length >= 3 && uname.length <= 30,
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const em = e.target.value;
    setEmail(em);
    // Email regex: требует точку в домене
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidations(prev => ({
      ...prev,
      emailValid: emailRegex.test(em),
    }));
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
    setSubmitted(true);

    if (!validations.usernameLength || !validations.emailValid || !validations.length || !validations.match) {
      toast.error(t('register.messages.checkRequirements'));
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
        throw new Error(txt || t('register.messages.registrationError'));
      }

      const loginRes = await fetch("http://localhost:5200/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        toast.success(t('register.messages.registrationSuccess'));
        router.push("/login");
        return;
      }

      const user = await getCurrentUser();
      if (user) {
        login(user);
      }

      toast.success(t('register.messages.welcome'));
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.message || t('register.messages.unknownError'));
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
            <p>{t('register.tagline')}</p>
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t('register.benefits.signup')}</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t('register.benefits.favorites')}</span>
              </div>
              <div className={styles.benefitItem}>
                <span>✓</span>
                <span>{t('register.benefits.tracking')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>{t('register.title')}</h2>
              <p>{t('register.subtitle')}</p>
            </div>

            <form onSubmit={handleRegister} className={styles.form}>
              {/* Username */}
              <div className={styles.formGroup}>
                <label htmlFor="username">{t('register.username')}</label>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.icon} />
                  <input
                    id="username"
                    type="text"
                    placeholder={t('register.usernamePlaceholder')}
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
                {username && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
                    <span style={{ color: validations.usernameLength ? "var(--success-color)" : "var(--danger-color, #ef4444)" }}>
                      ✓ 3-30 символов
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <Mail size={20} className={styles.icon} />
                  <input
                    id="email"
                    type="text"
                    placeholder={t('register.emailPlaceholder')}
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                {email && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
                    <span style={{ color: validations.emailValid ? "var(--success-color)" : "var(--danger-color, #ef4444)" }}>
                      ✓ Формат: user@domain.extension
                    </span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password">{t('register.password')}</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.icon} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
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
                {password && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
                    <span style={{ color: validations.length ? "var(--success-color)" : "var(--danger-color, #ef4444)" }}>
                      ✓ Минимум 8 символов
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirm">{t('register.confirmPassword')}</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.icon} />
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={handleConfirmChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirm && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
                    <span style={{ color: validations.match ? "var(--success-color)" : "var(--danger-color, #ef4444)" }}>
                      ✓ Пароли совпадают
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitBtn} disabled={loading || !Object.values(validations).every(v => v)}>
                {loading ? (
                  <span className={styles.loading} />
                ) : (
                  <>
                    <span>{t('register.submit')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className={styles.signUpLink}>
              <p>{t('register.hasAccount')} <Link href="/login">{t('register.login')}</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
