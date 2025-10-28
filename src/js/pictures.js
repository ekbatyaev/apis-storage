document.getElementById('new-quote').addEventListener('click', loadQuote);

async function loadQuote() {
    const container = document.getElementById('quote-container');
    container.innerHTML = `
        <div class="quote-card" style="text-align: center;">
            <div class="spinner"></div>
            <p>Загрузка изображения...</p>
        </div>
    `;

    try {
        const response = await fetch('https://nekos.best/api/v2/neko');
        const data = await response.json();
        
        if (data.results && data.results[0] && data.results[0].url) {
            container.innerHTML = `
                <div class="quote-card">
                    <img src="${data.results[0].url}" alt="Аниме изображение" 
                         onerror="this.style.display='none'">
                    <div style="text-align: center; margin-top: 1rem;">
                    </div>
                </div>
            `;
        } else {
            throw new Error('Некорректный ответ от API');
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = `
            <div class="quote-card" style="text-align: center;">
                <h3>Не удалось загрузить изображение</h3>
                <p>${error.message}</p>
                <button onclick="loadQuote()" style="margin-top: 1rem;">
                    🔄 Попробовать снова
                </button>
            </div>
        `;
    }
}

window.loadQuote = loadQuote;

document.addEventListener('DOMContentLoaded', loadQuote);