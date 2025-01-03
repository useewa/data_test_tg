document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const submitBtn = document.getElementById('submitBtn');
    let selectedDate = null;

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

    // Отправка выбранной даты в Telegram
    submitBtn.addEventListener('click', () => {
        if (!selectedDate) {
            alert('Пожалуйста, выберите дату!');
            return;
        }

        if (Telegram.WebApp) {
            Telegram.WebApp.sendData(selectedDate);
        } else {
            alert(`Выбрана дата: ${selectedDate}`);
        }
    });
});