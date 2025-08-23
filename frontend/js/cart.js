async function loadCart() {
  const response = await fetch(`/api/CartItems`, {
    credentials: 'include'
  });

  if (!response.ok) {
    alert("Ошибка загрузки корзины");
    return;
  }

  const items = await response.json();
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = "";

  let total = 0;

  items.forEach(item => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.productName}">
      <div class="cart-item-details">
        <h3>${item.productName}</h3>
        <p>Цена: ${item.price} $</p>
        <p>
          Количество: 
          <input type="number" value="${item.quantity}" min="1" style="width: 60px"
            onchange="updateQuantity('${item.id}', this.value)">
        </p>
      </div>
      <button onclick="deleteItem('${item.id}')">Удалить</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  document.getElementById("totalPrice").innerHTML = `Итого: ${total} $`;
}

async function deleteItem(id) {
  if (!confirm("Удалить товар из корзины?")) return;

  const response = await fetch(`/api/CartItems/${id}`, {
    method: "DELETE",
    credentials: 'include'
  });

  if (response.ok) {
    loadCart();
  } else {
    alert("Ошибка удаления");
  }
}

async function updateQuantity(id, quantity) {
  if (quantity < 1) {
    alert("Количество не может быть меньше 1");
    loadCart();
    return;
  }

  const response = await fetch(`/api/CartItems/${id}/quantity`, {
    method: "PATCH",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ quantity: parseInt(quantity) })
  });

  if (!response.ok) {
    alert("Ошибка обновления количества");
    loadCart();
  } else {
    loadCart();
  }
}

async function clearCart() {
  if (!confirm("Очистить корзину?")) return;

  const response = await fetch(`/api/CartItems/clear`, {
    method: "DELETE",
    credentials: 'include'
  });

  if (response.ok) {
    loadCart();
  } else {
    alert("Ошибка очистки корзины");
  }
}

async function createOrder() {
  if (!confirm("Создать заказ из корзины?")) return;

  const response = await fetch(`/api/Orders`, {
    method: "POST",
    credentials: 'include'
  });

  if (response.ok) {
    alert("Заказ создан!");
    loadCart();
  } else {
    alert("Ошибка создания заказа");
  }
}

window.onload = loadCart;