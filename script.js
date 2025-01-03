document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const submitBtn = document.getElementById('submitBtn');
    const tg = window.Telegram.WebApp;
    tg.MainButton.text;
    let selectedDate = null;

    // Получаем данные о пользователе из Telegram WebApp
    const user = tg.initDataUnsafe?.user;  // Данные пользователя (id, username, имя, фамилия и т.д.)
    const userInfo = document.getElementById('userInfo'); // Элемент, в который будет выведена информация о пользователе
    const entryTime = new Date();  // Время входа в приложение

    // Выводим информацию о пользователе в элемент с id "userInfo"
    userInfo.innerHTML = `
        <p><strong>Привет, ${user.first_name}!</strong></p>
        <p>Ваш username: @${user.username}</p>
        <p>Вы вошли в приложение: ${entryTime.toLocaleString()}</p>
    `;

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
            selectedDate = `${year}-${month + 1}-${day}`;
        });
        calendar.appendChild(button);
    }

    // Отправка выбранной даты в Telegram по кнопке submit
    submitBtn.addEventListener('click', () => {
        if (!selectedDate) {
            alert('Пожалуйста, выберите дату!');
            return;
        }

        // Отправляем выбранную дату обратно в Telegram
        tg.sendData(JSON.stringify({ data: selectedDate }));
    });

    // Слушаем клик по основной кнопке Telegram
    tg.onEvent('mainButtonClicked', () => {
        if (selectedDate) {
            tg.sendData(JSON.stringify({ data: selectedDate }));  // Отправляем выбранную дату
        } else {
            alert('Пожалуйста, выберите дату!');
        }
    });
});
