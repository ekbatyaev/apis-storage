import React from 'react';
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
    <a 
      href={href} 
      className={`${styles.link} ${styles[getHoverColor(index)]}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  );
};

export default PageLink;