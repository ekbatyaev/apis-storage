const container = document.getElementById('anime-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const typeSelect = document.getElementById('type');

let allAnime = [];
let isLoading = false;

let cache = {
    data: null,
    timestamp: null,
    expiry: 30 * 60 * 1000
};

function showLoading(message = 'Загрузка аниме...') {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; opacity: 0.8;">${message}</p>
        </div>
    `;
}

function showError(message) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Ошибка</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.8;">${message}</p>
            <button onclick="loadAnime()" class="retry-button">🔄 Попробовать снова</button>
        </div>
    `;
}

async function loadAnime() {
    if (isLoading) return;
    isLoading = true;

    if (cache.data && cache.timestamp && (Date.now() - cache.timestamp) < cache.expiry) {
        allAnime = cache.data;
        renderAnime(allAnime);
        isLoading = false;
        return;
    }

    try {
        const query = `
            query {
                Page(page: 1, perPage: 50) {
                    media(type: ANIME, sort: SCORE_DESC) {
                        id
                        title { romaji english native }
                        coverImage { large medium extraLarge }
                        averageScore
                        format
                        startDate { year }
                        episodes
                        status
                    }
                }
            }
        `;

        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        
        if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error');

        const media = data.data?.Page?.media || [];
        
        if (media.length === 0) throw new Error('Нет данных');

        allAnime = media.map(item => ({
            id: item.id,
            title: item.title.romaji || item.title.english || item.title.native,
            image: item.coverImage?.extraLarge || item.coverImage?.large || item.coverImage?.medium,
            score: item.averageScore ? (item.averageScore / 10).toFixed(1) : 'N/A',
            type: mapAnimeType(item.format),
            year: item.startDate?.year || '-',
            episodes: item.episodes
        }));

        cache.data = allAnime;
        cache.timestamp = Date.now();

        renderAnime(allAnime);

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError('Не удалось загрузить данные. Проверьте подключение к интернету.');
    }
    
    isLoading = false;
}

function mapAnimeType(type) {
    const typeMap = {
        'TV': 'TV',
    };
    return typeMap[type] || type || '-';
}

// Заглушка для изображений
function getPlaceholderImage(title = 'Аниме') {
    const svg = `<svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2a3a5a;stop-opacity:1"/><stop offset="100%" style="stop-color:#1a2a4a;stop-opacity:1"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="45%" font-family="Arial" font-size="14" fill="#7c8ab0" text-anchor="middle" dy=".3em">🎌</text>
        <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#9ca8d0" text-anchor="middle" dy=".3em">${title.substring(0, 15)}${title.length > 15 ? '...' : ''}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function renderAnime(list) {
    if (!list || list.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">🔍 Ничего не найдено</div>';
        return;
    }

    container.innerHTML = list.map((anime, index) => `
        <div class="anime-card" style="animation-delay: ${index * 0.03}s">
            <img src="${anime.image || getPlaceholderImage(anime.title)}" 
                 alt="${anime.title}" 
                 class="anime-poster"
                 loading="lazy"
                 onerror="this.src='${getPlaceholderImage(anime.title)}'">
            <div class="anime-info">
                <h3 class="anime-title" title="${anime.title}">${anime.title}</h3>
                <p class="anime-meta">⭐ ${anime.score} | ${anime.type} | ${anime.year}</p>
                ${anime.episodes ? `<p class="anime-episodes">📺 Эпизодов: ${anime.episodes}</p>` : ''}
            </div>
        </div>
    `).join('');

    // Анимация появления
    setTimeout(() => {
        document.querySelectorAll('.anime-card').forEach(card => card.classList.add('fade-in'));
    }, 100);
}

let filterTimeout;
function applyFilters() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        if (!allAnime.length) return;

        let filtered = allAnime.filter(anime => {
            const searchMatch = !searchInput.value.trim() || 
                anime.title.toLowerCase().includes(searchInput.value.toLowerCase().trim());
            const typeMatch = typeSelect.value === 'all' || 
                anime.type.toLowerCase() === typeSelect.value.toLowerCase();
            return searchMatch && typeMatch;
        });

        switch (sortSelect.value) {
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'score':
                filtered.sort((a, b) => {
                    const scoreA = a.score === 'N/A' ? 0 : parseFloat(a.score);
                    const scoreB = b.score === 'N/A' ? 0 : parseFloat(b.score);
                    return scoreB - scoreA;
                });
                break;
            case 'year':
                filtered.sort((a, b) => {
                    const yearA = a.year === '-' ? 0 : parseInt(a.year);
                    const yearB = b.year === '-' ? 0 : parseInt(b.year);
                    return yearB - yearA;
                });
                break;
        }

        renderAnime(filtered);
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = 'Обновить';
    refreshBtn.onclick = () => {
        cache.data = null;
        cache.timestamp = null;
        loadAnime();
    };
    document.querySelector('.filters')?.appendChild(refreshBtn);

    searchInput.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    typeSelect.addEventListener('change', applyFilters);

    loadAnime();
});

const style = document.createElement('style');
style.textContent = `
    .anime-card { opacity: 0; transform: translateY(20px); transition: all 0.5s ease; }
    .anime-card.fade-in { opacity: 1; transform: translateY(0); }
    .anime-poster { width: 100%; height: 280px; object-fit: cover; border-radius: 8px; background: linear-gradient(45deg, #2a3a5a, #1a2a4a); }
    .anime-episodes { font-size: 0.8rem; opacity: 0.7; margin-top: 0.3rem; }
    .retry-button { padding: 12px 24px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600; }
    .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);