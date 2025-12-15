import { useEffect, useState } from 'react';
import styles from './Anime.module.scss';

interface AnimeItem {
    id: number;
    title: string;
    image: string;
    score: string;
    type: string;
    year: string;
    episodes?: number;
}

export default function Anime() {
    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
    const [filteredList, setFilteredList] = useState<AnimeItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('score');
    const [type, setType] = useState('all');
    const [filtersActive, setFiltersActive] = useState(false);

    // Загрузка данных
    const loadAnime = async () => {
        setLoading(true);
        setError('');
        try {
            const query = `
        query {
          Page(page: 1, perPage: 50) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title { romaji english native }
              coverImage { extraLarge }
              averageScore
              format
              startDate { year }
              episodes
            }
          }
        }
      `;
            const res = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await res.json();
            const media = data.data?.Page?.media || [];

            const list = media.map((item: any) => ({
                id: item.id,
                title: item.title.romaji || item.title.english || item.title.native,
                image: item.coverImage?.extraLarge || '',
                score: item.averageScore ? (item.averageScore / 10).toFixed(1) : 'N/A',
                type: mapType(item.format),
                year: item.startDate?.year || '-',
                episodes: item.episodes,
            }));

            setAnimeList(list);
            setFilteredList(list);
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить данные. Проверьте подключение к интернету.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // По умолчанию не загружаем сразу, ждем нажатия кнопки "Показать"
    }, []);

    // Фильтры и сортировка
    useEffect(() => {
        let list = [...animeList];

        if (search.trim()) {
            list = list.filter(a => a.title.toLowerCase().includes(search.toLowerCase().trim()));
        }

        if (type !== 'all') {
            list = list.filter(a => a.type.toLowerCase() === type.toLowerCase());
        }

        switch (sort) {
            case 'title':
                list.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'score':
                list.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
                break;
            case 'year':
                list.sort((a, b) => parseInt(b.year) - parseInt(a.year));
                break;
        }

        setFilteredList(list);
        
        // Проверяем, активны ли фильтры
        const hasActiveFilters = search.trim() !== '' || type !== 'all' || sort !== 'score';
        setFiltersActive(hasActiveFilters);
    }, [search, sort, type, animeList]);

    const mapType = (format: string) => {
        const map: Record<string, string> = {
            TV: 'TV',
            MOVIE: 'Фильм',
            OVA: 'OVA',
            SPECIAL: 'Спешл',
        };
        return map[format] || format || '-';
    };

    // Функция для сброса фильтров
    const resetFilters = () => {
        setSearch('');
        setType('all');
        setSort('score');
    };

    const getPlaceholderImage = (title = 'Аниме') => {
        const svg = `<svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2a3a5a;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#1a2a4a;stop-opacity:1"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="45%" font-family="Arial" font-size="14" fill="#7c8ab0" text-anchor="middle" dy=".3em">🎌</text>
      <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#9ca8d0" text-anchor="middle" dy=".3em">${title.substring(0, 15)}${title.length > 15 ? '...' : ''}</text>
    </svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h1>✨ Библиотека аниме ✨</h1>
                <p>Откройте для себя лучшие аниме-сериалы и фильмы</p>

                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="🔍 Поиск по названию..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="title">📝 По названию</option>
                        <option value="score">⭐ По рейтингу</option>
                        <option value="year">📅 По году</option>
                    </select>
                    
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="all">🎬 Все типы</option>
                        <option value="TV">📺 TV</option>
                        <option value="Фильм">🎞️ Фильм</option>
                        <option value="OVA">💿 OVA</option>
                        <option value="Спешл">🌟 Спешл</option>
                    </select>
                    
                    <button className={styles.showButton} onClick={loadAnime}>
                        🎭 Показать аниме
                    </button>
                    
                    {filtersActive && (
                        <button 
                            className={styles.resetButton} 
                            onClick={resetFilters}
                            title="Сбросить все фильтры"
                        >
                            🔄 Сбросить фильтры
                        </button>
                    )}
                </div>
            </header>

            <main id="anime-list" className={styles.animeGrid}>
                {loading && (
                    <div className={styles.spinnerContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка аниме...</p>
                    </div>
                )}
                
                {error && (
                    <div className={styles.errorContainer}>
                        <div className={styles.errorIcon}>😔</div>
                        <p>{error}</p>
                        <button className={styles.retryButton} onClick={loadAnime}>
                            🔄 Попробовать снова
                        </button>
                    </div>
                )}
                
                {!loading && !error && filteredList.map((anime, index) => (
                    <div
                        key={anime.id}
                        className={`${styles.animeCard} ${styles.fadeIn}`}
                        style={{ animationDelay: `${index * 0.03}s` }}
                    >
                        <img
                            src={anime.image || getPlaceholderImage(anime.title)}
                            alt={anime.title}
                            className={styles.animePoster}
                            onError={(e) => (e.currentTarget.src = getPlaceholderImage(anime.title))}
                        />
                        <div className={styles.animeInfo}>
                            <h3 className={styles.animeTitle} title={anime.title}>{anime.title}</h3>
                            <p className={styles.animeMeta}>
                                ⭐ {anime.score} | {anime.type} | {anime.year}
                            </p>
                            {anime.episodes && (
                                <p className={styles.animeEpisodes}>
                                    📺 Эпизодов: {anime.episodes}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </main>

            <footer className={styles.pageFooter}>
                <p>© 2025. Аниме Вселенная. Все права защищены.</p>
            </footer>
        </div>
    );
}