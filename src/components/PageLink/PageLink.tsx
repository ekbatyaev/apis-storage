import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageLink.module.scss';
import { PageLinkProps } from './types';

const PageLink: React.FC<PageLinkProps> = ({ title, href, index }) => {
    const getHoverColor = (idx: number) => {
        switch (idx) {
            case 0: return 'primary';
            case 1: return 'secondary';
            case 2: return 'accent';
            default: return 'primary';
        }
    };

    return (
        <Link
            to={href}
            className={`${styles.link} ${styles[getHoverColor(index)]}`}
        >
            {title}
        </Link>
    );
};

export default PageLink;