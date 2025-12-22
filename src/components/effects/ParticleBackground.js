import { useEffect, useRef } from 'react';
import './ParticleBackground.scss';

const ParticleBackground = ({ particleCount = 50 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = [
      { main: '#00ff88', glow: 'rgba(0, 255, 136, 0.5)' },
      { main: '#ff00ff', glow: 'rgba(255, 0, 255, 0.5)' },
      { main: '#00d9ff', glow: 'rgba(0, 217, 255, 0.5)' }
    ];

    let mouseX = 0;
    let mouseY = 0;

    class Particle {
      constructor() {
        this.reset();
        this.baseX = this.x;
        this.baseY = this.y;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.colorIndex = Math.floor(Math.random() * colors.length);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }

        // Return to base position slowly
        this.x += (this.baseX - this.x) * 0.02;
        this.y += (this.baseY - this.y) * 0.02;

        // Normal movement
        this.baseY += this.speedY;
        this.baseX += this.speedX;

        // Wrap around screen
        if (this.baseY < -10) this.baseY = canvas.height + 10;
        if (this.baseY > canvas.height + 10) this.baseY = -10;
        if (this.baseX < -10) this.baseX = canvas.width + 10;
        if (this.baseX > canvas.width + 10) this.baseX = -10;

        // Update pulse
        this.pulsePhase += 0.02;
      }

      draw() {
        const colorObj = colors[this.colorIndex];
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const size = this.size * pulse;

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorObj.glow;

        // Main particle
        ctx.fillStyle = colorObj.main;
        ctx.globalAlpha = this.opacity * pulse;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw connections between nearby particles
    const drawConnections = () => {
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, colors[particles[i].colorIndex].main);
            gradient.addColorStop(1, colors[particles[j].colorIndex].main);

            ctx.strokeStyle = gradient;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Draw connections first (behind particles)
      drawConnections();

      // Draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach(p => p.reset());
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount]);

  return <canvas ref={canvasRef} className="particle-background" />;
};

export default ParticleBackground;
