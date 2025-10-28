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
    container.innerHTML = `
        <div class="loading-container" style="display: flex; justify-content: center; align-items: center; min-height: 400px; width: 100%;">
            <div style="text-align: center;">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; opacity: 0.8;">${message}</p>
            </div>
        </div>
    `;
}

function showError(message) {
    container.innerHTML = `
        <div class="error-container">
            <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
            <h3>Ошибка</h3>
            <p>${message}</p>
            <button onclick="loadPlaces(1)" class="retry-button">Попробовать снова</button>
        </div>
    `;
}

function renderPlaces(places) {
    if (!places.length) {
        container.innerHTML = `
            <div class="empty-container">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>Места не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }

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

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allPlaces.filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm) ||
        place.address.toLowerCase().includes(searchTerm)
    );
    renderPlaces(filtered);
});

prefectureSelect.addEventListener('change', () => {
    applyFilters();
});

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const prefectureValue = prefectureSelect.value;

    const filtered = allPlaces.filter(place => {
        const searchMatch = !searchTerm || 
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm);
        const prefectureMatch = prefectureValue === 'all' || place.prefecture === prefectureValue;
        
        return searchMatch && prefectureMatch;
    });

    renderPlaces(filtered);
}

loadMoreBtn.addEventListener('click', () => {
    loadPlaces(currentPage + 1);
});

document.addEventListener('DOMContentLoaded', () => {
    loadPlaces(1);
});