"use client";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header>
        <h1>OnlineStore</h1>
        <button
          className={`menu-burger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
        </button>
        <div
          className="header-menu"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <nav>
            <a href="/">Главная</a>
            <a href="#">Корзина</a>
            <a href="#">История заказов</a>
            <a href="/profile">Профиль</a>
          </nav>
        </div>
      </header>
      <div
        className={`overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
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
