"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

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

      setSuccess("✅ Успешный вход!");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Вход в аккаунт</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <p className="text-small">
          Нет аккаунта? <a href="/register">Зарегистрироваться</a>
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
          animation: fadeIn 0.4s ease;
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
          margin: 10px 0;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
          transition: 0.2s;
        }

        input:focus {
          border-color: royalblue;
          box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.15);
        }

        button {
          margin-top: 10px;
          padding: 12px;
          background: royalblue;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
        }

        button:hover {
          background: darkblue;
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(1px);
        }

        .text-small {
          margin-top: 15px;
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
          margin-top: 15px;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          animation: slideIn 0.3s ease;
        }

        .alert.error {
          background: #fee2e2;
          color: #b91c1c;
        }

        .alert.success {
          background: #dcfce7;
          color: #166534;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            width: 90%;
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}
