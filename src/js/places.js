const container = document.getElementById('places-list');
const searchInput = document.getElementById('search');
const prefectureSelect = document.getElementById('prefecture');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;
let allPlaces = [];
let isLoading = false;

async function loadPlaces(page = 1) {
    if (isLoading) return;
    isLoading = true;

    showLoading('Загрузка достопримечательностей...');

    try {
        // const response = await fetch(`https://api.geonames.org/searchJSON?country=JP&featureClass=P&maxRows=50&username=cerseieh&startRow=${(page - 1) * 50}`);
        const response = await fetch(`https://secure.geonames.org/searchJSON?country=JP&featureClass=P&maxRows=50&username=cerseieh&startRow=${(page - 1) * 50}`);


        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        
        const data = await response.json();
        
        if (!data.geonames || data.geonames.length === 0) throw new Error('Достопримечательности не найдены');

        const placesData = data.geonames.map((place, index) => ({
            id: place.geonameId,
            name: place.name,
            name_ja: place.name,
            description: place.fcodeName || 'Достопримечательность Японии',
            prefecture: getPrefectureFromAdmin(place.adminCode1),
            address: place.adminName1 || 'Япония',
            population: place.population || 0,
            elevation: place.elevation || 0
        }));

        if (page === 1) {
            allPlaces = placesData;
        } else {
            allPlaces = allPlaces.concat(placesData);
        }

        renderPlaces(allPlaces);
        currentPage = page;

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError(`Не удалось загрузить достопримечательности: ${error.message}`);
    }
    
    isLoading = false;
}

function getPrefectureFromAdmin(adminCode) {
    const prefectures = {
        '01': 'hokkaido',
        '13': 'tokyo',
        '26': 'kyoto',
        '27': 'osaka',
        '28': 'hyogo',
        '40': 'fukuoka',
        '47': 'okinawa'
    };
    return prefectures[adminCode] || 'other';
}

function showLoading(message) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '400px';
    container.style.width = '100%';
    container.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; opacity: 0.8;">${message}</p>
        </div>
    `;
}

function showError(message) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '400px';
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Ошибка</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.8;">${message}</p>
            <button onclick="loadPlaces(1)" class="retry-button">🔄 Попробовать снова</button>
        </div>
    `;
}

function renderPlaces(places) {
    if (!places.length) {
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.minHeight = '400px';
        container.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="margin-bottom: 1rem;">Места не найдены</h3>
                <p style="opacity: 0.8;">Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }

    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';
    container.style.minHeight = '';
    
    container.innerHTML = places.map(place => `
        <div class="place-item">
            <div class="place-header">
                <h3 class="place-name">${place.name}</h3>
                <span class="place-prefecture-badge">${getPrefectureLabel(place.prefecture)}</span>
            </div>
            <div class="place-details">
                <p class="place-description">${place.description}</p>
                <div class="place-meta">
                    ${place.population > 0 ? `<span class="place-population">👥 ${place.population.toLocaleString()} чел.</span>` : ''}
                    ${place.elevation > 0 ? `<span class="place-elevation">⛰️ ${place.elevation}м</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getPrefectureLabel(prefecture) {
    const labels = {
        'hokkaido': '🗾 Хоккайдо',
        'tokyo': '🏙️ Токио',
        'kyoto': '🎎 Киото',
        'osaka': '🏯 Осака',
        'hyogo': '🌉 Хёго',
        'fukuoka': '🌊 Фукуока',
        'okinawa': '🏝️ Окинава',
        'other': '📍 Другая префектура'
    };
    return labels[prefecture] || '🇯🇵 Япония';
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const prefectureValue = prefectureSelect.value;

    if (!allPlaces.length) {
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.minHeight = '400px';
        container.innerHTML = `
            <div style="text-align: center;">
                <p style="opacity: 0.8;">Нажмите "Показать" для загрузки мест</p>
            </div>
        `;
        return;
    }

    const filtered = allPlaces.filter(place => {
        const searchMatch = !searchTerm || 
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm);
        const prefectureMatch = prefectureValue === 'all' || place.prefecture === prefectureValue;
        
        return searchMatch && prefectureMatch;
    });

    renderPlaces(filtered);
}

searchInput.addEventListener('input', applyFilters);
prefectureSelect.addEventListener('change', applyFilters);

loadMoreBtn.addEventListener('click', () => {
    loadPlaces(currentPage + 1);
});

document.addEventListener('DOMContentLoaded', () => {
    loadMoreBtn.textContent = 'Показать';
    loadMoreBtn.onclick = () => {
        loadPlaces(1);
    };
    
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '400px';
    container.innerHTML = `
        <div style="text-align: center;">
            <p style="opacity: 0.8;">Нажмите "Показать" для загрузки достопримечательностей</p>
        </div>
    `;
});