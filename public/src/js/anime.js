const container = document.getElementById('anime-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const typeSelect = document.getElementById('type');

let allAnime = [];

async function loadAnime() {
    container.innerHTML = '<p>Загрузка аниме...</p>';
    try {
        let all = [];
        for (let page = 1; page <= 4; page++) {
            const response = await fetch('https://api.jikan.moe/v4/top/anime?page=' + page + '&limit=25');
            const data = await response.json();
            all = all.concat(data.data);
            container.innerHTML = '<p>Загружено страниц: ' + page + '/4...</p>';
            await new Promise(function(r) { setTimeout(r, 400); });
        }
        allAnime = all;
        renderAnime(allAnime);
    } catch (error) {
        container.innerHTML = '<p>Ошибка загрузки: ' + error.message + '</p>';
    }
}

function renderAnime(list) {
    if (!list.length) {
        container.innerHTML = '<p>Ничего не найдено.</p>';
        return;
    }

    let html = '';
    list.forEach(function(anime) {
        html += '<div class="anime-card">';
        html += '<img src="' + anime.images.jpg.image_url + '" alt="' + anime.title + '" class="anime-poster">';
        html += '<div class="anime-info">';
        html += '<h3 class="anime-title">' + anime.title + '</h3>';
        html += '<p class="anime-meta">⭐ ' + (anime.score ?? 'N/A') + ' | ' + (anime.type ?? '-') + ' | ' + (anime.year ?? '-') + '</p>';
        html += '</div></div>';
    });

    container.innerHTML = html;
}

function applyFilters() {
    let filtered = allAnime.slice();
    const searchValue = searchInput.value.toLowerCase();
    const typeValue = typeSelect.value;

    if (searchValue) {
        filtered = filtered.filter(function(a){ return a.title.toLowerCase().includes(searchValue); });
    }
    if (typeValue !== 'all') {
        filtered = filtered.filter(function(a){ return (a.type || '').toLowerCase() === typeValue; });
    }

    switch (sortSelect.value) {
        case 'title':
            filtered.sort(function(a,b){ return a.title.localeCompare(b.title); });
            break;
        case 'score':
            filtered.sort(function(a,b){ return (b.score ?? 0) - (a.score ?? 0); });
            break;
        case 'year':
            filtered.sort(function(a,b){ return (b.year ?? 0) - (a.year ?? 0); });
            break;
    }

    renderAnime(filtered);
}

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
typeSelect.addEventListener('change', applyFilters);

loadAnime();