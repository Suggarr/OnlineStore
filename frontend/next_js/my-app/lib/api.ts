export const API_BASE = "http://localhost:5200/api";

export const api = {
  products: `${API_BASE}/Products`,
  categories: `${API_BASE}/Categories`,
  users: `${API_BASE}/Users`,
  orders: `${API_BASE}/Orders`,
  cart: `${API_BASE}/CartItems`,
  favorites: `${API_BASE}/Favorites`,
};

export default api;