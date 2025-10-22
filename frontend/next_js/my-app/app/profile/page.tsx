"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("http://localhost:5200/api/users/infome", {
        credentials: "include",
      });
      if (res.ok) {
        const data: UserData = await res.json();
        setUser(data);
        setEditUsername(data.username);
        setEditEmail(data.email);
      } else setUser(null);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5200/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    const res = await fetch("http://localhost:5200/api/users/infome/name", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: editUsername, email: editEmail }),
    });
    if (res.ok) {
      setUser({ ...user, username: editUsername, email: editEmail });
      setIsEditModalOpen(false);
      alert("Информация обновлена!");
    } else {
      alert("Ошибка при обновлении.");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Заполните все поля.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают.");
      return;
    }

    const res = await fetch("http://localhost:5200/api/users/infome/password", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (res.ok) {
      alert("Пароль изменён! Войдите снова.");
      handleLogout();
    } else {
      alert("Ошибка при смене пароля.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img src="https://i.pravatar.cc/120" alt="avatar" className="avatar" />
          <div className="profile-info">
            <h2>{user?.username || "Гость"}</h2>
            <p>{user?.email || "Не вошли в аккаунт"}</p>
            <p className="role">Роль: <strong>{user?.role || "Пользователь"}</strong></p>
          </div>
        </div>

        <div className="buttons">
          <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>Редактировать</button>
          <button className="password-btn" onClick={() => setIsPasswordModalOpen(true)}>Сменить пароль</button>
          <button className="logout-btn" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      {/* Редактирование профиля */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Редактировать профиль</h3>
            <input
              type="text"
              value={editUsername}
              placeholder="Имя"
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <input
              type="email"
              value={editEmail}
              placeholder="Email"
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Отмена</button>
              <button className="save-btn" onClick={handleProfileUpdate}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Смена пароля */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Смена пароля</h3>
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsPasswordModalOpen(false)}>Отмена</button>
              <button className="save-btn" onClick={handlePasswordChange}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background: #f5f5f7;
          font-family: "Segoe UI", sans-serif;
        }

        .profile-card {
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.1);
          width: 400px;
          text-align: center;
        }

        .profile-header {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-info h2 {
          margin: 0;
          font-size: 26px;
        }

        .profile-info p {
          margin: 4px 0;
          color: #555;
        }

        .role {
          font-weight: 600;
          color: #2563eb;
        }

        .buttons {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .edit-btn, .password-btn, .logout-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        .edit-btn { background: #2563eb; color: white; }
        .edit-btn:hover { background: #1d4ed8; }

        .password-btn { background: #f59e0b; color: white; }
        .password-btn:hover { background: #d97706; }

        .logout-btn { background: #ef4444; color: white; }
        .logout-btn:hover { background: #dc2626; }

        .modal-overlay {
          position: fixed;
          top:0; left:0;
          width:100%; height:100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 25px;
          border-radius: 16px;
          width: 360px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .cancel-btn {
          background: #e5e7eb;
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }

        .save-btn {
          background: #2563eb;
          color: white;
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
