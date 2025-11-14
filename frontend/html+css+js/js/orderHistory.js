async function loadOrders() {
  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  try {
    const response = await fetch(`http://localhost:5200/api/orders`, {
      credentials: 'include' // JWT cookie
    });

    if (!response.ok) {
      container.innerHTML = 'Не удалось загрузить заказы.';
      return;
    }

    const orders = await response.json();

    if (orders.length === 0) {
      container.innerHTML = '<p>У вас пока нет заказов.</p>';
      return;
    }

    orders.forEach(order => {
      const orderDiv = document.createElement('div');
      orderDiv.classList.add('order');

      const date = new Date(order.createdAt).toLocaleDateString();

      let total = 0;

      const itemsHtml = order.items.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
          <div class="order-item">
            <img src="${item.imageUrl}" alt="${item.productName}">
            <div class="item-info">
              <span>Товар: ${item.productName}</span>
              <span>Цена: ${item.price} $</span>
              <span>Количество: ${item.quantity}</span>
              <span>Сумма: ${itemTotal} $</span>
            </div>
          </div>
        `;
      }).join('');

      orderDiv.innerHTML = `
        <div class="order-header">
          <div>Заказ № <span>${order.id}</span></div>
          <div>Дата: <span>${date}</span></div>
        </div>
        <div class="order-items">
          ${itemsHtml}
          <div class="order-item"><strong>Итого: ${total} $</strong></div>
        </div>
      `;

      container.appendChild(orderDiv);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = 'Произошла ошибка при загрузке заказов.';
  }
}

loadOrders();
