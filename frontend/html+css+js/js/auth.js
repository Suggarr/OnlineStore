function toggleForm() {
    document.getElementById('auth-container').classList.toggle('active');
}
async function register(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    // if (password.length < 8) {
    // alert('Пароль должен содержать не менее 8 символов.');
    // return;
    // }
    const data = {
    username: name,
    email: email,
    password: password
    };
    
    try {
    const response = await fetch(`/api/users/register`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        alert('Регистрация прошла успешно!');
        toggleForm(); // Переключаемся на форму входа
    } else if (response.status === 409) {
        alert('Пользователь с таким email или именем уже существует.');
    } 
    else if (response.status === 400) {
    alert('Имя пользователя должно быть не менее 3 символов и не более 30, а email должен быть корректным.\nПароль должен быть не короче 8 символов');
    }
    else {
        alert('Ошибка при регистрации');
    }
    } catch (error) {
    console.error('Ошибка при регистрации:', error);
    alert('Ошибка сети');
    }
}

async function login(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const data = {
    email: email,
    password: password
    };

    try {
    const response = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        credentials: 'include', // Очень важно: отправляем куки при запросах
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Успешный вход!');
        window.location.href = 'mainPage.html';
    } else if (response.status === 401) {
        alert('Неверный email или пароль.');
    }
    else {
        alert('Ошибка при входе');
    }

    } catch (error) {
    console.error('Ошибка при входе:', error);
    alert('Ошибка сети');
    }
}

// Проверяем есть ли авторизация при загрузке страницы
window.onload = async function() {
    try {
    const response = await fetch(`/api/users/infome`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        // Пользователь авторизован — переходим на главную страницу
        window.location.href = 'mainPage.html';
    } 
    // если 401 — остаемся на странице логина
    } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    // При ошибке сети — можно тоже ничего не делать
    }
}

document.querySelector('.form.login').addEventListener('submit', login);
document.querySelector('.form.register').addEventListener('submit', register);