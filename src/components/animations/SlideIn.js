import { motion } from 'framer-motion';

const SlideIn = ({ children, delay = 0, duration = 0.6, direction = 'left', className = '' }) => {
  const directions = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 }
  };

  return (
    <motion.div
      className={className}
      initial={directions[direction]}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
