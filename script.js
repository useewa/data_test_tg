document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const dateInfo = document.getElementById('dateInfo');
    const tg = window.Telegram.WebApp;
    const userInfo = document.getElementById('userInfo');
    let selectedDate = null;

    // Получаем данные о пользователе из Telegram WebApp
    const user = tg.initDataUnsafe?.user;
    const entryTime = new Date(); 

    // Выводим информацию о пользователе
    if (user) {
        userInfo.innerHTML = `
            <p><strong>Привет, ${user.first_name}!</strong></p>
            <p>Ваш username: @${user.username}</p>
            <p>Вы вошли в приложение: ${entryTime.toLocaleString()}</p>
        `;
    } else {
        userInfo.innerHTML = `<p>Не удалось получить информацию о пользователе.</p>`;
    }

    // Функция для загрузки информации о датах (из сервера или CSV файла)
    function loadData() {
        fetch('path/to/your/csvfile.csv')  // Здесь путь к вашему CSV файлу
            .then(response => response.text())
            .then(data => {
                const records = parseCSV(data);
                createCalendar(records);
            });
    }

    // Преобразование CSV данных в массив
    function parseCSV(data) {
        const rows = data.split('\n');
        return rows.map(row => {
            const [date, time, district, address, user] = row.split(',');
            return { date, time, district, address, user };
        });
    }

    // Генерация календаря
    function createCalendar(records) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const button = document.createElement('button');
            button.textContent = day;
            const date = `${day}-${month + 1}-${year}`;
            const dateRecords = records.filter(record => record.date === date);
            
            // Подсветка ячейки в зависимости от количества записей
            if (dateRecords.length >= 2) {
                button.classList.add('red'); // Больше 1 записи — красный
            } else if (dateRecords.length > 0) {
                button.classList.add('green'); // 1 запись — зеленый
            }

            button.addEventListener('click', () => {
                selectedDate = date;
                displayDateInfo(dateRecords);
            });

            calendar.appendChild(button);
        }
    }

    // Отображение информации о выбранной дате
    function displayDateInfo(records) {
        if (records.length > 0) {
            dateInfo.innerHTML = `
                <h2>Информация о дате ${selectedDate}</h2>
                <ul>
                    ${records.map(record => `
                        <li>
                            <strong>Время выхода:</strong> ${record.time}<br>
                            <strong>Район:</strong> ${record.district}<br>
                            <strong>Адрес:</strong> ${record.address}<br>
                            <strong>Записался:</strong> ${record.user}
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            dateInfo.innerHTML = `<p>На эту дату никто не записался.</p>`;
        }
    }

    // Загружаем данные при загрузке страницы
    loadData();

    // Настроим кнопку Telegram
    tg.MainButton.text = "Отправить выбранную дату";  
    tg.MainButton.show();  

    tg.MainButton.onClick(() => {
        if (selectedDate) {
            tg.sendData(JSON.stringify({ selectedDate }));
        } else {
            alert('Пожалуйста, выберите дату!');
            tg.sendData(JSON.stringify({ selectedDate: null }));
        }
    });
});
