document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const tg = window.Telegram.WebApp;
    let selectedDate = null;

    // Получаем данные о пользователе из Telegram WebApp
    const user = tg.initDataUnsafe?.user;  // Данные пользователя (id, username, имя, фамилия и т.д.)
    const userInfo = document.getElementById('userInfo'); // Элемент, в который будет выведена информация о пользователе
    const entryTime = new Date();  // Время входа в приложение

    // Проверка на наличие данных о пользователе
    if (user) {
        // Выводим информацию о пользователе в элемент с id "userInfo"
        userInfo.innerHTML = `
            <p><strong>Привет, ${user.first_name}!</strong></p>
            <p>Ваш username: @${user.username}</p>
            <p>Вы вошли в приложение: ${entryTime.toLocaleString()}</p>
        `;
    } else {
        userInfo.innerHTML = `<p>Не удалось получить информацию о пользователе.</p>`;
    }

    // Генерация календаря для текущего месяца
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 — январь, 11 — декабрь

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const button = document.createElement('button');
        button.textContent = day;
        button.addEventListener('click', () => {
            // Снять выделение с других кнопок
            document.querySelectorAll('#calendar button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedDate = new Date(year, month, day);
            selectedDate = formatDate(selectedDate);
        });
        calendar.appendChild(button);
    }

    // Слушаем клик по основной кнопке Telegram
    tg.MainButton.text = "Отправить выбранную дату";  // Устанавливаем текст на кнопке
    tg.MainButton.show();  // Показываем кнопку, если она скрыта

    tg.MainButton.onClick(() => {
        if (selectedDate) {
            tg.sendData(JSON.stringify({}));  // Отправляем выбранную дату
        } else {
            alert('Пожалуйста, выберите дату!');
            tg.sendData(JSON.stringify({ selectedDate: null }));  // Отправляем, что дата не выбрана
        }
    });

    // Функция для форматирования даты в ДД.ММ.ГГГГ
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11, поэтому прибавляем 1
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
});
