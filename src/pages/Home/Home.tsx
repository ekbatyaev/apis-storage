import React from 'react';
import Header from '../../components/Header/Header';
import ParticlesBackground from '../../components/ParticlesBackground/ParticlesBackground';
import PageLink from '../../components/PageLink/PageLink';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const links = [
    { title: 'Библиотека аниме', href: 'src/html/anime.html' },
    { title: 'Картинки из аниме', href: 'src/html/pictures.html' },
    { title: 'Путешествие по Японии', href: 'src/html/places.html' },
  ];

  return (
    <div className={styles.container}>
      <ParticlesBackground />
      
      <Header 
        title="Аниме Вселенная" 
        subtitle="Добро пожаловать в мир аниме!" 
      />
      
      <main className={styles.links}>
        {links.map((link, index) => (
          <PageLink 
            key={index}
            title={link.title}
            href={link.href}
            index={index}
          />
        ))}
      </main>

      <footer className={styles.footer}>
        <p>© 2025. Аниме Вселенная. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Home;