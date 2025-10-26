document.getElementById('new-quote').addEventListener('click', loadQuote);

async function loadQuote() {
    const container = document.getElementById('quote-container');
    container.innerHTML = '<p>Загрузка...</p>';

    try {
        const fallbackResponse = await fetch('https://nekos.best/api/v2/neko');
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.results && fallbackData.results[0] && fallbackData.results[0].url) {
            container.innerHTML = `
                <div class="quote-card">
                    <img src="${fallbackData.results[0].url}" alt="Аниме изображение" style="max-width: 300px; border-radius: 8px;">
                    <p>Изображение предоставлено API Nekos.best</p>
                </div>
            `;
        } else {
            throw new Error('Запасной API тоже не сработал');
        }
    } catch (fallbackError) {
        console.error('Ошибка запасного API:', fallbackError);
        container.innerHTML = `
            <div class="quote-card">
                <p>⚠️ Не удалось загрузить изображение</p>
                <p>Попробуйте позже или проверьте подключение к интернету</p>
            </div>
        `;
    }
}

// Делаем функцию доступной глобально
window.loadQuote = loadQuote;