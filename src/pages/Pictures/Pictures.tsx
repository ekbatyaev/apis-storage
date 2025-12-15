import React, { useState } from 'react';
import styles from './Pictures.module.scss';

export default function Pictures() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadQuote = async () => {
        setLoading(true);
        setError('');
        setImageUrl(null);

        try {
            const response = await fetch('https://nekos.best/api/v2/neko');
            const data = await response.json();

            if (data.results && data.results[0] && data.results[0].url) {
                setImageUrl(data.results[0].url);
            } else {
                throw new Error('Некорректный ответ от API');
            }
        } catch (err: any) {
            console.error('Ошибка загрузки:', err);
            setError('Не удалось загрузить изображение. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>✨ Аниме изображения ✨</h1>
                <p>Коллекция красивых аниме картинок</p>
                <button className={styles.showButton} onClick={loadQuote}>
                    Получить изображение
                </button>
            </header>

            <main>
                <div className={styles.quoteContainer}>
                    {!loading && !error && !imageUrl && (
                        <div className={styles.quoteCard}>
                            <p>Нажмите кнопку, чтобы загрузить изображение.</p>
                        </div>
                    )}

                    {loading && (
                        <div className={styles.quoteCard}>
                            <div className={styles.spinner}></div>
                            <p>Загрузка изображения...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.quoteCard}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                Ошибка
                            </h3>
                            <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{error}</p>
                            <button className={styles.retryButton} onClick={loadQuote}>
                                🔄 Попробовать снова
                            </button>
                        </div>
                    )}

                    {imageUrl && !loading && !error && (
                        <div className={`${styles.quoteCard} ${styles.imageContainer}`}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={imageUrl}
                                    alt="Аниме изображение"
                                    className={styles.animeImage}
                                    onError={(e) => {
                                        e.currentTarget.src = '';
                                        setError('Ошибка загрузки изображения.');
                                        setImageUrl(null);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className={styles.pageFooter}>
                <p>© 2025. Аниме Вселенная. Все права защищены.</p>
            </footer>
        </>
    );
}