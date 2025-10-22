"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // форма
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // простая валидация на клиенте
    if (!username.trim() || !email.trim() || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают.");
      return;
    }
    if (password.length < 8) {
      setError("Пароль должен быть минимум 8 символов.");
      return;
    }

    setLoading(true);
    try {
      // 1) Регистрируем пользователя
      const regRes = await fetch("http://localhost:5200/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        // no credentials here — register возвращает 200/409, но cookie ставит login
      });

      if (!regRes.ok) {
        const txt = await regRes.text().catch(() => "");
        throw new Error(txt || "Ошибка при регистрации");
      }

      // 2) После успешной регистрации — сразу логинимся (бек кладёт AppCookie)
      const loginRes = await fetch("http://localhost:5200/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // обязательно — чтобы cookie с токеном сохранилась
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const txt = await loginRes.text().catch(() => "");
        // Если логин не удался — сообщаем, но регистрация уже прошла
        setSuccess("Регистрация прошла. Пожалуйста, выполните вход.");
        setLoading(false);
        router.push("/login");
        return;
      }

      // Успешная регистрация + логин
      setSuccess("Регистрация и вход выполнены успешно! Перенаправление...");
      // небольшой таймаут, чтобы пользователь увидел сообщение
      setTimeout(() => router.push("/profile"), 900);
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Создать аккаунт</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="name"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Обработка..." : "Создать аккаунт"}
          </button>
        </form>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <p className="text-small">
          Уже есть аккаунт? <a href="/login">Войти</a>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80vh;
          background: #f3f4f7;
        }

        .auth-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          width: 360px;
          text-align: center;
          animation: fadeIn 0.35s ease;
        }

        h2 {
          margin-bottom: 20px;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        input {
          margin: 8px 0;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          transition: 0.15s;
        }

        input:focus {
          border-color: royalblue;
          box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.12);
        }

        button {
          margin-top: 12px;
          padding: 12px;
          background: royalblue;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: transform 0.12s, background 0.12s;
        }

        button:hover {
          background: darkblue;
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .text-small {
          margin-top: 14px;
          font-size: 14px;
        }

        a {
          color: royalblue;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .alert {
          margin-top: 14px;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          animation: slideIn 0.25s ease;
        }

        .alert.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .alert.success {
          background: #dcfce7;
          color: #065f46;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .auth-card { width: 92%; padding: 22px; }
        }
      `}</style>
    </div>
  );
}
