import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className={styles.header}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </header>
    );
};

export default Header;