import { useState } from 'react';
import styles from './Places.module.scss';

interface PlaceItem {
    id: number;
    name: string;
    prefecture: string;
    description?: string;
    population?: number;
    elevation?: number;
}

export default function Places() {
    const [places, setPlaces] = useState<PlaceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [prefecture, setPrefecture] = useState('all');

    const loadPlaces = async () => {
        setLoading(true);
        setError('');
        setPlaces([]);

        try {
            // Используем GeoNames API как в старом коде
            const response = await fetch(
                `https://secure.geonames.org/searchJSON?country=JP&featureClass=P&maxRows=50&username=egorbatyaev`
            );
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

            const data = await response.json();
            const fetchedPlaces = data.geonames.map((p: any) => ({
                id: p.geonameId,
                name: p.name,
                prefecture: mapPrefecture(p.adminCode1),
                description: p.fcodeName || 'Достопримечательность Японии',
                population: p.population,
                elevation: p.elevation
            }));
            setPlaces(fetchedPlaces);
        } catch (err: any) {
            console.error(err);
            setError('Не удалось загрузить достопримечательности.');
        } finally {
            setLoading(false);
        }
    };

    const mapPrefecture = (code: string) => {
        const map: Record<string, string> = {
            '01': 'hokkaido',
            '13': 'tokyo',
            '26': 'kyoto',
            '27': 'osaka',
            '28': 'hyogo',
            '40': 'fukuoka',
            '47': 'okinawa'
        };
        return map[code] || 'other';
    };

    const filteredPlaces = places.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchPref = prefecture === 'all' || p.prefecture === prefecture;
        return matchSearch && matchPref;
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>✨ Путешествие по Японии ✨</h1>
                <p>Откройте для себя удивительные места и достопримечательности Японии</p>

                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Поиск мест..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select value={prefecture} onChange={e => setPrefecture(e.target.value)}>
                        <option value="all">Все префектуры</option>
                        <option value="hokkaido">Хоккайдо</option>
                        <option value="tokyo">Токио</option>
                        <option value="kyoto">Киото</option>
                        <option value="osaka">Осака</option>
                        <option value="hyogo">Хёго</option>
                        <option value="fukuoka">Фукуока</option>
                        <option value="okinawa">Окинава</option>
                        <option value="other">Другие префектуры</option>
                    </select>

                    <button onClick={loadPlaces} className={styles.loadButton}>Показать</button>
                </div>
            </header>

            <main className={styles.placesGrid}>
                {loading && (
                    <div className={styles.spinnerContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка достопримечательностей...</p>
                    </div>
                )}
                {error && <p>{error}</p>}
                {!loading && !error && filteredPlaces.map(place => (
                    <div key={place.id} className={styles.placeCard}>
                        <div className={styles.placeHeader}>
                            <h3>{place.name}</h3>
                            <span className={styles.prefectureBadge}>{place.prefecture}</span>
                        </div>
                        <p>{place.description}</p>
                        <div className={styles.placeMeta}>
                            {place.population && <span>👥 {place.population.toLocaleString()}</span>}
                            {place.elevation && <span>⛰️ {place.elevation}м</span>}
                        </div>
                    </div>
                ))}
            </main>

            <footer className={styles.pageFooter}>
                <p>© 2025. Аниме Вселенная. Все права защищены.</p>
            </footer>
        </>
    );
}