document.getElementById('new-quote').addEventListener('click', loadQuote);

async function loadQuote() {
    const container = document.getElementById('quote-container');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '60vh';
    
    container.innerHTML = `
        <div class="quote-card" style="text-align: center; width: 100%;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">Загрузка изображения...</p>
        </div>
    `;

    try {
        const response = await fetch('https://nekos.best/api/v2/neko');
        const data = await response.json();
        
        if (data.results && data.results[0] && data.results[0].url) {
            container.style.display = 'block';
            container.style.minHeight = '';
            container.innerHTML = `
                <div class="quote-card image-container">
                    <div class="image-wrapper">
                        <img src="${data.results[0].url}" alt="Аниме изображение" 
                             class="anime-image"
                             onerror="handleImageError(this)">
                    </div>
                    <div style="text-align: center; margin-top: 1rem;">
                    </div>
                </div>
            `;
        } else {
            throw new Error('Некорректный ответ от API');
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.minHeight = '60vh';
        container.innerHTML = `
            <div class="quote-card" style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
                <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Не удалось загрузить изображение</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.8;">${error.message}</p>
                <button onclick="loadQuote()" class="retry-button">
                    🔄 Попробовать снова
                </button>
            </div>
        `;
    }
}

function handleImageError(img) {
    const container = img.closest('.image-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.style.textAlign = 'center';
        errorDiv.style.padding = '2rem';
        errorDiv.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Ошибка загрузки изображения</h3>
            <p style="opacity: 0.8;">Изображение не может быть загружено</p>
        `;
        container.querySelector('.image-wrapper').innerHTML = '';
        container.querySelector('.image-wrapper').appendChild(errorDiv);
    }
}

window.loadQuote = loadQuote;
window.handleImageError = handleImageError;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('quote-container');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '60vh';
    container.innerHTML = `
        <div class="quote-card" style="text-align: center;">
            <p style="opacity: 0.8;">Нажмите кнопку, чтобы загрузить изображение</p>
        </div>
    `;
});

document.head.appendChild(style);