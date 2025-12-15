import React from 'react';
import Header from '../../components/Header/Header';
import ParticlesBackground from '../../components/ParticlesBackground/ParticlesBackground';
import PageLink from '../../components/PageLink/PageLink';
import styles from './Home.module.scss';

const Home: React.FC = () => {
    // Ссылки теперь через React Router (без .html)
    const links = [
        { title: 'Библиотека аниме', href: '../Anime' },
        { title: 'Картинки из аниме', href: '../Pictures' },
        { title: 'Путешествие по Японии', href: '../Places' },
    ];

    return (
        <div className={styles.container}>
            {/* Анимированные частицы на фоне */}
            <ParticlesBackground />

            {/* Заголовок страницы */}
            <Header
                title="Аниме Вселенная"
                subtitle="Добро пожаловать в мир аниме!"
            />

            {/* Ссылки на разделы */}
            <main className={styles.links}>
                {links.map((link, index) => (
                    <PageLink
                        key={index}
                        title={link.title}
                        href={link.href} // React Router Link
                        index={index}
                    />
                ))}
            </main>

            {/* Подвал */}
            <footer className={styles.footer}>
                <p>© 2025. Аниме Вселенная. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Home;