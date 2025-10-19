const container = document.getElementById('anime-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const typeSelect = document.getElementById('type');

let allAnime = [];

async function loadAnime() {
    container.innerHTML = '<p>Загрузка аниме...</p>';
    try {
        let all = [];

        // Загружаем 4 страницы (4 × 25 = 100 аниме)
        for (let page = 1; page <= 4; page++) {
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
            const data = await response.json();
            all = all.concat(data.data);

            // Показываем прогресс пользователю
            container.innerHTML = `<p>Загружено страниц: ${page}/4...</p>`;
            await new Promise(r => setTimeout(r, 400)); // небольшая пауза для плавности
        }

        allAnime = all;
        renderAnime(allAnime);
    } catch (error) {
        container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    }
}

function renderAnime(list) {
    if (!list.length) {
        container.innerHTML = '<p>Ничего не найдено.</p>';
        return;
    }

    container.innerHTML = list.map(anime => `
        <div class="anime-card">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-poster">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <p class="anime-meta">
                    ⭐ ${anime.score ?? 'N/A'} | ${anime.type ?? '-'} | ${anime.year ?? '-'}
                </p>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    let filtered = [...allAnime];
    const searchValue = searchInput.value.toLowerCase();
    const typeValue = typeSelect.value;

    if (searchValue) {
        filtered = filtered.filter(a => a.title.toLowerCase().includes(searchValue));
    }

    if (typeValue !== 'all') {
        filtered = filtered.filter(a => (a.type || '').toLowerCase() === typeValue);
    }

    switch (sortSelect.value) {
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'score':
            filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
            break;
        case 'year':
            filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
            break;
    }

    renderAnime(filtered);
}

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
typeSelect.addEventListener('change', applyFilters);

loadAnime();