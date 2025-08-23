async function loadProducts() {
  const response = await fetch(`/api/products`, {
    credentials: 'include'
  });

  if (!response.ok) {
    alert('Ошибка загрузки товаров');
    return;
  }

  const products = await response.json();
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="description">${product.description}</p>
        <p class="price">${product.price} $</p>
      </div>
      <button onclick="addToCart('${product.id}')">Купить</button>
    `;
    container.appendChild(div);
  });
}

async function addToCart(productId) {
  const dto = { productId: productId, quantity: 1 };

  const response = await fetch(`/api/cartitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dto)
  });

  if (response.ok) {
    alert('Товар добавлен в корзину');
  } else if (response.status === 404) {
    alert('Товар не найден');
  } else {
    alert('Ошибка при добавлении в корзину');
  }
}

window.onload = loadProducts;
