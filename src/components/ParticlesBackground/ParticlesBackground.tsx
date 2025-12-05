import React, { useEffect, useState } from 'react';
import styles from './ParticlesBackground.module.scss';
import { Particle } from './Particle';

const ParticlesBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticles = () => {
      const particleCount = 15;
      const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
      
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        color: colors[i % colors.length],
        delay: Math.random() * 6
      }));

      setParticles(newParticles);
    };

    createParticles();
  }, []);

  return (
    <div className={styles.particles}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;