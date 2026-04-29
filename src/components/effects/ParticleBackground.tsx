import React, { useEffect, useRef } from 'react';
import { ParticleBackgroundProps } from '../../types';
import './ParticleBackground.scss';

/**
 * Color Configuration Interface
 */
interface ColorConfig {
  main: string;
  glow: string;
}

/**
 * Particle Class
 *
 * Represents a single particle in the animation
 * Handles movement, mouse interaction, and rendering
 */
class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speedX: number;
  speedY: number;
  colorIndex: number;
  opacity: number;
  pulsePhase: number;

  private canvas: HTMLCanvasElement;
  private colors: ColorConfig[];
  private ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    colors: ColorConfig[]
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;

    // Initialize with default values
    this.x = 0;
    this.y = 0;
    this.baseX = 0;
    this.baseY = 0;
    this.size = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.colorIndex = 0;
    this.opacity = 0;
    this.pulsePhase = 0;

    this.reset();
    this.baseX = this.x;
    this.baseY = this.y;
  }

  reset(): void {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.colorIndex = Math.floor(Math.random() * this.colors.length);
    this.opacity = Math.random() * 0.5 + 0.3;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(mouseX: number, mouseY: number): void {
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
    if (this.baseY < -10) this.baseY = this.canvas.height + 10;
    if (this.baseY > this.canvas.height + 10) this.baseY = -10;
    if (this.baseX < -10) this.baseX = this.canvas.width + 10;
    if (this.baseX > this.canvas.width + 10) this.baseX = -10;

    // Update pulse
    this.pulsePhase += 0.02;
  }

  draw(): void {
    const colorObj = this.colors[this.colorIndex];
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    const size = this.size * pulse;

    // Glow effect
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = colorObj.glow;

    // Main particle
    this.ctx.fillStyle = colorObj.main;
    this.ctx.globalAlpha = this.opacity * pulse;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner glow
    this.ctx.globalAlpha = this.opacity * 0.3;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
  }
}

/**
 * ParticleBackground Component
 *
 * Renders an animated particle background with canvas
 * Features mouse interaction, connections between particles, and pulsing effects
 */
const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors: ColorConfig[] = [
      { main: '#00ff88', glow: 'rgba(0, 255, 136, 0.5)' },
      { main: '#ff00ff', glow: 'rgba(255, 0, 255, 0.5)' },
      { main: '#00d9ff', glow: 'rgba(0, 217, 255, 0.5)' }
    ];

    let mouseX = 0;
    let mouseY = 0;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx, colors));
    }

    // Draw connections between nearby particles
    const drawConnections = (): void => {
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
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

    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Draw connections first (behind particles)
      drawConnections();

      // Draw particles
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach((p) => p.reset());
    };

    const handleMouseMove = (e: MouseEvent): void => {
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

  return <canvas ref={canvasRef} className={`particle-background ${className}`} />;
};

export default ParticleBackground;
