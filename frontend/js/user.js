let currentUser = null;
let currentUserId = null;
let currentUsername = '';
let currentEmail = '';

async function loadUserProfile() {
    try {
    const response = await fetch(`/api/users/infome`, { credentials: 'include' });
    if (!response.ok) {
        alert('Не удалось загрузить данные пользователя');
        return;
    }
    const user = await response.json();
    currentUser = user;
    currentUserId = user.id;
    currentUsername = user.username;
    currentEmail = user.email;
    document.getElementById('displayId').textContent = maskId(user.id);
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayEmail').textContent = user.email;
    document.getElementById('displayRole').textContent = user.role;
    if (user.role === 'Admin') {
        document.getElementById('adminPanel').style.display = 'block';
        loadAllUsers();
        loadAllProducts();
    }
    } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
    alert('Ошибка при загрузке профиля');
    }
}
window.onload = loadUserProfile;
function openEditModal() {
    document.getElementById('newUsername').value = currentUsername;
    document.getElementById('newEmail').value = currentEmail;
    document.getElementById('editModal').style.display = 'flex';
}
function maskId(id) {
    if (!id || id.length < 8) return '********';
    return id.substring(0, 8) + '****************';
}
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}
async function updateProfile() {
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    if (!username || !email) {
    alert('Заполните оба поля');
    return;
    }
    const response = await fetch(`/api/users/infome/name`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email })
    });
    if (response.status === 200) {
    alert('Данные обновлены');
    closeEditModal();
    loadUserProfile();
    } 
    else if (response.status === 400) {
    alert('Имя пользователя должно быть не менее 3 символов и не более 30, а email должен быть корректным');
    }
    else {
    alert('Ошибка при обновлении');
    }
}
function openPasswordModal() {
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('passwordModal').style.display = 'flex';
}
function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
}
async function changePassword() {
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (!oldPassword || !newPassword || !confirmPassword) {
    alert('Заполните все поля');
    return;
    }
    if (newPassword !== confirmPassword) {
    alert('Новый пароль и подтверждение не совпадают');
    return;
    }
    const dto = { 
    oldPassword: oldPassword, 
    newPassword: newPassword 
    };
    
    // if (newPassword.length < 8) {
    // alert('Пароль должен быть не менее 8 символов');
    // return;
    // }
    const response = await fetch(`/api/users/infome/password`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
    });
    if (response.ok) {
    alert('Пароль успешно обновлен. Пожалуйста, войдите заново.');
    closePasswordModal();
    window.location.href = 'startPage.html';
    } else if (response.status === 409) {
    alert('Старый пароль введен неверно.');
    } 
    else if (response.status === 400) {
    alert('Пароль должен быть не короче 8 символов');
    } else {
    alert('Ошибка при смене пароля');
    }
}
async function logout() {
    const response = await fetch(`/api/Users/logout`, {
    method: 'POST',
    credentials: 'include'
    });
    if (response.ok || response.status === 204) {
    window.location.href = 'startPage.html';
    } else {
    alert('Ошибка при выходе');
    }
}

function showTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}
async function loadAllUsers() {
    try {
    const response = await fetch(`/api/users`, { credentials: 'include' });
    if (!response.ok) {
        alert('Не удалось загрузить пользователей');
        return;
    }
    const users = await response.json();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${maskId(user.id)}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>`;
        tbody.appendChild(tr);
    });
    } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    }
}
async function loadAllProducts() {
    try {
    const response = await fetch(`/api/products`, { credentials: 'include' });
    if (!response.ok) {
        alert('Не удалось загрузить товары');
        return;
    }
    const products = await response.json();
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price} $</td>
        <td>${product.description}</td>
        <td><img src="${product.imageUrl}" alt="Фото" style="width: 130px; height: 130px; object-fit: cover;"></td>
        <td>
            <button class="action-button edit-button" onclick="openEditProductModal('${product.id}', '${product.name}', ${product.price}, '${product.description}', '${product.imageUrl}')">Редактировать</button>
            <button class="action-button delete-button" onclick="deleteProduct('${product.id}')">Удалить</button>
        </td>`;
        tbody.appendChild(tr);
    });
    } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    }
}

function openCreateProductModal() {
    document.getElementById('createProductModal').style.display = 'flex';
}

function closeCreateProductModal() {
    document.getElementById('createProductModal').style.display = 'none';
}

let editingProductId = null;

function openEditProductModal(id, name, price, description, imageUrl) {
    editingProductId = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductDescription').value = description;
    document.getElementById('editProductImageUrl').value = imageUrl;
    document.getElementById('editProductModal').style.display = 'flex';
}

function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

async function saveProductChanges() {
    const updatedProduct = {
    id: editingProductId,
    name: document.getElementById('editProductName').value.trim(),
    price: parseFloat(document.getElementById('editProductPrice').value),
    description: document.getElementById('editProductDescription').value.trim(),
    imageUrl: document.getElementById('editProductImageUrl').value.trim()
    };

    const response = await fetch(`/api/products/${editingProductId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
    });

    if (response.ok) {
    alert('Товар успешно обновлён');
    closeEditProductModal();
    loadAllProducts();
    } else {
    alert('Ошибка при обновлении товара');
    }
}

async function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    credentials: 'include'
    });

    if (response.ok) {
    alert('Товар удалён');
    loadAllProducts();
    } else {
    alert('Ошибка при удалении товара');
    }
}

async function createProduct() {
    const name = document.getElementById('createProductName').value.trim();
    const price = parseFloat(document.getElementById('createProductPrice').value);
    const description = document.getElementById('createProductDescription').value.trim();
    const imageUrl = document.getElementById('createProductImageUrl').value.trim();

    if (!name || isNaN(price) || price <= 0 || !description || !imageUrl) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
    }

    const newProduct = { name, price, description, imageUrl };

    try {
    const response = await fetch(`/api/products`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });

    if (response.ok) {
        alert('Товар успешно добавлен');
        closeCreateProductModal();
        loadAllProducts(); // Обновляем таблицу товаров
    } else {
        const errorData = await response.json();
        alert('Ошибка при добавлении товара: ' + (errorData.message || response.statusText));
    }
    } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    alert('Ошибка при добавлении товара');
    }
}