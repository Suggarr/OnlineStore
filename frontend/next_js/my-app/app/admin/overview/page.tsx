"use client";

import "./overview.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastOrders, setLastOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("http://localhost:5200/api/admin/overview", {
        credentials: "include",
      });
      const data = await res.json();

      setStats(data.stats);
      setSales(data.sales);
      setCategories(data.categories);
      setLastOrders(data.lastOrders);
    } catch (e) {
      console.error("Ошибка загрузки", e);
    }
  }

  return (
    <div className="overview-container">

      <h1 className="overview-title">📊 Обзор статистики</h1>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Пользователи</h3>
          <p>{stats.users}</p>
        </div>

        <div className="stat-card">
          <h3>Товары</h3>
          <p>{stats.products}</p>
        </div>

        <div className="stat-card">
          <h3>Заказы</h3>
          <p>{stats.orders}</p>
        </div>

        <div className="stat-card">
          <h3>Доход за месяц</h3>
          <p>{stats.revenue} $</p>
        </div>
      </div>

      {/* Графики */}
      <div className="charts-grid">

        <div className="chart-card">
          <h3>📈 Продажи</h3>
          <LineChart width={500} height={250} data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4e8cff" strokeWidth={3} />
          </LineChart>
        </div>

        <div className="chart-card">
          <h3>🏷️ Категории</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categories.map((_, index) => (
                <Cell
                  key={index}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>

      {/* Последние заказы */}
      <div className="orders-card">
        <h3>🧾 Последние покупки</h3>

        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Сумма</th>
              <th>Дата</th>
            </tr>
          </thead>

          <tbody>
            {lastOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user}</td>
                <td>{o.total} ₽</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
