"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/utils/auth";

// Тип данных пользователя
export type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  const navItems = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Корзина", href: "/cart" },
  ];

  // Получаем текущего пользователя при загрузке
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();

    // Слушаем событие изменения пользователя
    const handler = (e: CustomEvent) => setUser(e.detail);
    window.addEventListener("userChanged", handler as EventListener);
    return () =>
      window.removeEventListener("userChanged", handler as EventListener);
  }, []);

  // Выход из аккаунта
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push("/login");
      setMenuOpen(false);

      // Генерируем событие для других компонентов
      window.dispatchEvent(
        new CustomEvent("userChanged", { detail: null })
      );
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  const menuLinks = user
    ? [...navItems, { label: `Профиль (${user.username})`, href: "/profile" }]
    : navItems;

  return (
    <>
      <header>
        <div className="logo" onClick={() => router.push("/")}>
          OnlineStore
        </div>

        <nav className="menu">
          {menuLinks.map((item, idx) => (
            <a key={item.href + idx} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="actions">
          <a href="/cart">
            <ShoppingCart />
          </a>

          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          ) : (
            <a href="/login">
              <User />
            </a>
          )}

          <button
            className={`menu-burger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
          </button>
        </div>

        <div className={`header-menu ${menuOpen ? "active" : ""}`}>
          <nav>
            {menuLinks.map((item, idx) => (
              <a
                key={"mobile_" + item.href + idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "20px",
                  background: "#ef4444",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Выйти
              </button>
            )}
          </nav>
        </div>

        <div
          className={`overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>
      </header>

      <style jsx>{`
        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-weight: 700;
          font-size: 1.6rem;
          color: royalblue;
          cursor: pointer;
        }

        .menu {
          display: flex;
          gap: 25px;
        }

        .menu a {
          text-decoration: none;
          color: #333;
          transition: 0.2s;
        }

        .menu a:hover {
          color: royalblue;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logout-btn {
          background: #ef4444;
          border: none;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        .menu-burger {
          display: none;
          background-color: transparent;
          width: 40px;
          height: 40px;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 1100;
        }

        .menu-burger span,
        .menu-burger span::before,
        .menu-burger span::after {
          display: block;
          width: 28px;
          height: 3px;
          background-color: royalblue;
          position: relative;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .menu-burger span::before,
        .menu-burger span::after {
          content: "";
          position: absolute;
          left: 0;
        }

        .menu-burger span::before {
          top: -8px;
        }

        .menu-burger span::after {
          bottom: -8px;
        }

        .menu-burger.active span {
          background: transparent;
        }

        .menu-burger.active span::before {
          transform: rotate(45deg);
          top: 0;
          background: white;
        }

        .menu-burger.active span::after {
          transform: rotate(-45deg);
          bottom: 0;
          background: white;
        }

        .header-menu {
          display: none;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .menu {
            display: none;
          }

          .menu-burger {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .header-menu {
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100vh;
            background-color: royalblue;
            flex-direction: column;
            padding-top: 80px;
            padding-left: 20px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }

          .header-menu.active {
            transform: translateX(0);
          }

          .header-menu nav a {
            display: block;
            padding: 12px 10px;
            margin: 8px 0;
            font-size: 18px;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
          }

          .header-menu nav a:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          .overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            z-index: 900;
          }

          .overlay.active {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </>
  );
}

// "use client";
// import { useState } from "react";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [user, setUser] = useState<string | null>(null); // null — не вошёл
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   return (
//     <>
//       <header>
//         <h1>OnlineStore</h1>

//         <nav className="header-nav">
//           <a href="/">Главная</a>
//           <a href="#">Корзина</a>
//           <a href="#">История заказов</a>
//           <a href="/profile">Профиль</a>

//           {!user ? (
//             <div className="auth-buttons">
//               <button onClick={() => setShowLogin(true)}>Войти</button>
//               <button onClick={() => setShowRegister(true)}>Регистрация</button>
//             </div>
//           ) : (
//             <div className="user-info">
//               <img src="https://i.pravatar.cc/40" alt="user" />
//               <span>{user}</span>
//               <button
//                 className="logout-btn"
//                 onClick={() => setUser(null)}
//               >
//                 Выйти
//               </button>
//             </div>
//           )}
//         </nav>

//         {/* Бургер для мобильных */}
//         <button
//           className={`menu-burger ${menuOpen ? "active" : ""}`}
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           <span></span>
//         </button>
//       </header>

//       {/* Всплывающее окно входа */}
//       {showLogin && (
//         <div className="modal-overlay" onClick={() => setShowLogin(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Вход</h2>
//             <input type="email" placeholder="Email" />
//             <input type="password" placeholder="Пароль" />
//             <button
//               onClick={() => {
//                 setUser("Иван Иванов");
//                 setShowLogin(false);
//               }}
//               className="save-btn"
//             >
//               Войти
//             </button>
//             <p className="modal-switch">
//               Нет аккаунта?{" "}
//               <span onClick={() => { setShowLogin(false); setShowRegister(true); }}>
//                 Зарегистрируйтесь
//               </span>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Всплывающее окно регистрации */}
//       {showRegister && (
//         <div className="modal-overlay" onClick={() => setShowRegister(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Регистрация</h2>
//             <input type="text" placeholder="Имя" />
//             <input type="email" placeholder="Email" />
//             <input type="password" placeholder="Пароль" />
//             <button
//               onClick={() => {
//                 setUser("Иван Иванов");
//                 setShowRegister(false);
//               }}
//               className="save-btn"
//             >
//               Создать аккаунт
//             </button>
//             <p className="modal-switch">
//               Уже есть аккаунт?{" "}
//               <span onClick={() => { setShowRegister(false); setShowLogin(true); }}>
//                 Войти
//               </span>
//             </p>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         header {
//           background: white;
//           padding: 15px 25px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }

//         h1 {
//           color: royalblue;
//           font-size: 22px;
//           margin: 0;
//         }

//         .header-nav {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//         }

//         .header-nav a {
//           color: #333;
//           text-decoration: none;
//           font-size: 16px;
//           transition: color 0.2s;
//         }

//         .header-nav a:hover {
//           color: royalblue;
//         }

//         .auth-buttons button {
//           background: royalblue;
//           border: none;
//           color: white;
//           padding: 8px 14px;
//           border-radius: 8px;
//           margin-left: 8px;
//           cursor: pointer;
//           transition: background 0.3s;
//         }

//         .auth-buttons button:hover {
//           background: #1d4ed8;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .user-info img {
//           border-radius: 50%;
//         }

//         .logout-btn {
//           background: #ef4444;
//           border: none;
//           color: white;
//           padding: 6px 10px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 13px;
//         }

//         /* --- модалки --- */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.4);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//         }

//         .modal {
//           background: white;
//           padding: 30px;
//           border-radius: 16px;
//           width: 360px;
//           animation: fadeIn 0.3s ease;
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
//           text-align: center;
//         }

//         .modal input {
//           width: 90%;
//           padding: 10px;
//           margin: 10px 0;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//           outline: none;
//         }

//         .save-btn {
//           background: royalblue;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: 0.3s;
//           width: 100%;
//           margin-top: 10px;
//         }

//         .modal-switch span {
//           color: royalblue;
//           cursor: pointer;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </>
//   );
// }
