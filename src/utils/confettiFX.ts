import confetti from 'canvas-confetti';

const PASTEL_COLORS = ['#BAE6FD', '#38BDF8', '#F472B6', '#EC4899', '#FDE047', '#FACC15', '#FFFFFF'];

// Confeti al abrir una caja individual
export const triggerGiftBurst = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 70,
    spread: 80,
    origin: { x, y },
    colors: PASTEL_COLORS,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.1,
    shapes: ['circle', 'square'],
  });

  // Chispas de estrellas
  confetti({
    particleCount: 25,
    angle: 60,
    spread: 55,
    origin: { x: Math.max(0.1, x - 0.05), y },
    colors: ['#FDE047', '#FACC15', '#FFFFFF'],
    shapes: ['star'],
    scalar: 1.2,
  });

  confetti({
    particleCount: 25,
    angle: 120,
    spread: 55,
    origin: { x: Math.min(0.9, x + 0.05), y },
    colors: ['#F472B6', '#38BDF8', '#FFFFFF'],
    shapes: ['star'],
    scalar: 1.2,
  });
};

// Gran espectáculo de fuegos artificiales para el Gran Montaje Final
export const triggerGrandFinaleCelebration = () => {
  const duration = 6 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 99999 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: number = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 60 * (timeLeft / duration);

    // Cañones laterales y centrales con colores de Wendy
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#38BDF8', '#F472B6', '#FDE047', '#FDF2F8'],
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#EC4899', '#BAE6FD', '#FACC15', '#FFFFFF'],
    });

    // Lluvia de estrellas doradas
    confetti({
      ...defaults,
      particleCount: 15,
      origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 },
      shapes: ['star'],
      colors: ['#FACC15', '#FEF08A', '#F472B6'],
      scalar: 1.4,
    });
  }, 350);
};

// Chispitas suaves para interacción
export const triggerMiniSparkle = (clientX: number, clientY: number) => {
  const x = clientX / window.innerWidth;
  const y = clientY / window.innerHeight;

  confetti({
    particleCount: 15,
    spread: 40,
    origin: { x, y },
    colors: ['#FDE047', '#F472B6', '#38BDF8'],
    shapes: ['star', 'circle'],
    scalar: 0.8,
    ticks: 60,
    gravity: 1.2,
  });
};
