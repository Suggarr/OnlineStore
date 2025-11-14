export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Общий обзор</h2>

      <div className="stats-grid">
        <div className="stat-card">🛒 Продажи: 124</div>
        <div className="stat-card">👤 Пользователи: 57</div>
        <div className="stat-card">🛍️ Товары: 32</div>
        <div className="stat-card">💸 Доход: 84 500 $</div>
      </div>
    </div>
  );
}
