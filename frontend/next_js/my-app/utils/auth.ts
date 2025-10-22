const API_URL = "http://localhost:5200/api/users";

export type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
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

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
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
  triggerUserChanged(user);
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Ошибка выхода");
  triggerUserChanged(null);
}

export async function getCurrentUser(): Promise<UserData | null> {
  const res = await fetch(`${API_URL}/infome`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Ошибка при получении данных пользователя");

  return await res.json();
}

// Генерация события для шапки при смене пользователя
export function triggerUserChanged(user: UserData | null) {
  window.dispatchEvent(new CustomEvent("userChanged", { detail: user }));
}
