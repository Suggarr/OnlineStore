const AUTH_API_URL = "http://localhost:5200/api/auth";
const API_URL = "http://localhost:5200/api/users";

export type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string; // дата регистрации
};

// Регистрация
export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Ошибка при регистрации");
  }
}

// Вход
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Ошибка входа");
  }

  const user = await getCurrentUser();
}

// Выход
export async function logoutUser() {
  const res = await fetch(`${AUTH_API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Ошибка выхода");
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<UserData | null> {
  const res = await fetch(`${API_URL}/infome`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Ошибка при получении данных пользователя");

  return await res.json();
}

// Обновление профиля
export async function updateUserProfile(data: { username: string; email: string }): Promise<UserData | null> {
  const res = await fetch(`${API_URL}/infome/name`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Ошибка обновления профиля");

  // Если бек возвращает только статус код, получаем актуальные данные отдельно
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0" || res.status === 204) {
    // Пустой ответ - получаем актуальные данные
    const updatedUser = await getCurrentUser();
    return updatedUser;
  }

  try {
    const updatedUser = await res.json();
    return updatedUser;
  } catch {
    const updatedUser = await getCurrentUser();
    return updatedUser;
  }
}


