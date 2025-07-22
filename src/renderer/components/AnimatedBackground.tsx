import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'books' | 'particles' | 'gradient';
  intensity?: 'low' | 'medium' | 'high';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'books', 
  intensity = 'medium' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Floating books animation
    if (variant === 'books') {
      const books: Array<{
        x: number;
        y: number;
        size: number;
        speed: number;
        opacity: number;
        rotation: number;
        rotationSpeed: number;
      }> = [];

      const bookCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;

      // Initialize books
      for (let i = 0; i < bookCount; i++) {
        books.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        books.forEach(book => {
          ctx.save();
          ctx.translate(book.x, book.y);
          ctx.rotate(book.rotation);
          ctx.globalAlpha = book.opacity;

          // Draw book shape
          const gradient = ctx.createLinearGradient(-book.size/2, -book.size/2, book.size/2, book.size/2);
          gradient.addColorStop(0, '#3E5C49');
          gradient.addColorStop(0.5, '#4A6A55');
          gradient.addColorStop(1, '#2E453A');

          ctx.fillStyle = gradient;
          ctx.fillRect(-book.size/2, -book.size/1.5, book.size, book.size * 1.3);

          // Book spine
          ctx.fillStyle = '#2E453A';
          ctx.fillRect(-book.size/2, -book.size/1.5, book.size * 0.1, book.size * 1.3);

          // Book pages
          ctx.fillStyle = 'rgba(243, 238, 217, 0.8)';
          ctx.fillRect(-book.size/2 + book.size * 0.1, -book.size/1.5 + 2, book.size * 0.8, book.size * 1.2);

          ctx.restore();

          // Update position
          book.y -= book.speed;
          book.rotation += book.rotationSpeed;

          if (book.y < -book.size) {
            book.y = canvas.height + book.size;
            book.x = Math.random() * canvas.width;
          }
        });

        requestAnimationFrame(animate);
      };

      animate();
    }

    // Particle system
    if (variant === 'particles') {
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        life: number;
        maxLife: number;
      }> = [];

      const particleCount = intensity === 'low' ? 30 : intensity === 'medium' ? 60 : 100;

      const addParticle = () => {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 3 + 1,
          life: 0,
          maxLife: Math.random() * 200 + 100
        });
      };

      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        addParticle();
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life++;

          const alpha = 1 - (particle.life / particle.maxLife);
          ctx.globalAlpha = alpha * 0.6;

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          gradient.addColorStop(0, '#3E5C49');
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          if (particle.life >= particle.maxLife || particle.y < -10) {
            particles.splice(index, 1);
            addParticle();
          }
        });

        requestAnimationFrame(animate);
      };

      animate();
    }

    // Dynamic gradient
    if (variant === 'gradient') {
      let time = 0;

      const animate = () => {
        time += 0.005;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        const hue1 = Math.sin(time) * 30 + 210; // Blue-green range
        const hue2 = Math.sin(time + Math.PI/3) * 30 + 150; // Green range
        const hue3 = Math.sin(time + Math.PI) * 30 + 45; // Yellow-orange range

        gradient.addColorStop(0, `hsla(${hue1}, 40%, 25%, 0.1)`);
        gradient.addColorStop(0.5, `hsla(${hue2}, 35%, 30%, 0.05)`);
        gradient.addColorStop(1, `hsla(${hue3}, 45%, 35%, 0.1)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(animate);
      };

      animate();
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.6
      }}
    />
  );
};