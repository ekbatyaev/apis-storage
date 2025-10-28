function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);