// src/something_2.js - Рабочая версия с AnimeChan API
console.log('quotes.js загружен!');

class QuotesManager {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.init();
    }

    init() {
        console.log('Инициализация менеджера цитат...');
        
        // Находим элементы DOM
        this.newQuoteBtn = document.getElementById('new-quote-btn');
        this.animeSelect = document.getElementById('anime-select');
        this.quoteContainer = document.getElementById('quote-container');
        
        if (!this.checkElements()) return;
        
        this.setupEventListeners();
        this.loadRandomQuote();
        
        console.log('Менеджер цитат инициализирован');
    }

    checkElements() {
        if (!this.newQuoteBtn || !this.animeSelect || !this.quoteContainer) {
            console.error('Не найдены элементы DOM:', {
                newQuoteBtn: !!this.newQuoteBtn,
                animeSelect: !!this.animeSelect, 
                quoteContainer: !!this.quoteContainer
            });
            return false;
        }
        return true;
    }

    setupEventListeners() {
        this.newQuoteBtn.addEventListener('click', () => this.loadRandomQuote());
        this.animeSelect.addEventListener('change', () => this.loadRandomQuote());
    }

    async loadRandomQuote() {
        console.log('Загрузка случайной цитаты...');
        
        try {
            this.showLoading();
            
            const selectedAnime = this.animeSelect.value;
            let quote;
            
            if (selectedAnime) {
                quote = await this.getQuoteByAnime(selectedAnime);
            } else {
                quote = await this.getRandomQuote();
            }
            
            this.displayQuote(quote, true);
            
        } catch (error) {
            console.error('Ошибка загрузки цитаты:', error);
            this.displayBackupQuote();
        }
    }

    // Основной метод для получения случайной цитаты
    async getRandomQuote() {
        console.log('Получение случайной цитаты из AnimeChan...');
        
        // Пробуем разные варианты URL AnimeChan
        const urls = [
            'https://animechan.xyz/api/random',
            'https://animechan.io/api/v1/random',
            'https://animechan.vercel.app/api/random',
            'https://api.animechan.io/v1/quotes/random'
        ];
        
        for (const url of urls) {
            try {
                console.log(`Пробуем URL: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    mode: 'cors'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const quote = await response.json();
                console.log('Успешно получена цитата:', quote);
                return quote;
                
            } catch (error) {
                console.warn(`URL ${url} не сработал:`, error.message);
                continue;
            }
        }
        
        throw new Error('Все URL AnimeChan недоступны');
    }

    // Метод для получения цитат по конкретному аниме
    async getQuoteByAnime(animeTitle) {
        console.log(`Поиск цитат для аниме: ${animeTitle}`);
        
        const urls = [
            `https://animechan.xyz/api/quotes/anime?title=${encodeURIComponent(animeTitle)}`,
            `https://animechan.io/api/v1/quotes?anime=${encodeURIComponent(animeTitle)}`,
            `https://animechan.vercel.app/api/quotes/anime?title=${encodeURIComponent(animeTitle)}`,
            `https://api.animechan.io/v1/quotes/anime?title=${encodeURIComponent(animeTitle)}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`Пробуем URL: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const quotes = await response.json();
                
                if (!quotes || quotes.length === 0) {
                    throw new Error(`Не найдено цитат для аниме "${animeTitle}"`);
                }
                
                // Выбираем случайную цитату из результатов
                const randomIndex = Math.floor(Math.random() * quotes.length);
                const quote = Array.isArray(quotes) ? quotes[randomIndex] : quotes;
                console.log('Успешно получена цитата:', quote);
                return quote;
                
            } catch (error) {
                console.warn(`URL ${url} не сработал:`, error.message);
                continue;
            }
        }
        
        throw new Error(`Не удалось найти цитаты для аниме "${animeTitle}"`);
    }

    showLoading() {
        this.quoteContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>🔄 Подключаемся к AnimeChan API...</p>
            </div>
        `;
    }

    displayQuote(quote, fromApi = true) {
        console.log('Отображение цитаты:', quote);
        
        if (!quote || !quote.quote) {
            throw new Error('Некорректные данные цитаты');
        }
        
        const sourceInfo = fromApi ? 
            '<p class="api-success">✅ Цитата загружена из AnimeChan API</p>' :
            '<p class="api-warning">⚠️ Используется локальная цитата</p>';
        
        this.quoteContainer.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">"${this.escapeHtml(quote.quote)}"</div>
                <div class="quote-author">— ${this.escapeHtml(quote.character)}</div>
                <div class="quote-anime">из аниме "${this.escapeHtml(quote.anime)}"</div>
                ${sourceInfo}
                <div class="quote-actions">
                    <button onclick="quotesManager.loadRandomQuote()" class="secondary-btn">
                        🔄 Еще цитата
                    </button>
                </div>
            </div>
        `;
        
        this.currentQuote = quote;
    }

    displayBackupQuote() {
        console.log('Показываем резервную цитату');
        
        const backupQuotes = [
            {
                quote: "Тот, кто не может пожертвовать всем, не сможет ничего изменить.",
                character: "Армин Арлерт",
                anime: "Attack on Titan"
            },
            {
                quote: "Сила не определяет, кто прав, а кто нет.",
                character: "Монки Д. Луффи", 
                anime: "One Piece"
            },
            {
                quote: "Настоящая сила приходит не от ненависти, а от защиты тех, кого любишь.",
                character: "Наруто Узумаки",
                anime: "Naruto"
            },
            {
                quote: "Если ты не будешь упорно трудиться, то не сможешь победить гения.",
                character: "Сакураги Кобаяши",
                anime: "Baby Steps"
            }
        ];
        
        const randomQuote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
        this.displayQuote(randomQuote, false);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Создаем стили для спиннера и индикаторов
function createCustomStyles() {
    if (document.getElementById('quotes-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'quotes-styles';
    style.textContent = `
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff6b9d;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .api-success {
            color: #28a745;
            font-size: 0.9rem;
            margin-top: 1rem;
            padding: 0.5rem;
            background: #f8fff9;
            border-radius: 5px;
            border: 1px solid #28a745;
        }
        
        .api-warning {
            color: #ffc107;
            font-size: 0.9rem;
            margin-top: 1rem;
            padding: 0.5rem;
            background: #fffef0;
            border-radius: 5px;
            border: 1px solid #ffc107;
        }
        
        .quote-actions {
            margin-top: 1.5rem;
            text-align: center;
        }
        
        .loading {
            text-align: center;
            padding: 2rem;
        }
        
        .loading p {
            margin: 0;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем QuotesManager...');
    createCustomStyles();
    window.quotesManager = new QuotesManager();
});