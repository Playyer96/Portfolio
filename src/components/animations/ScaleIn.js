import { motion } from 'framer-motion';

const ScaleIn = ({ children, delay = 0, duration = 0.4, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{
        scale: 0.8,
        opacity: 0
      }}
      whileInView={{
        scale: 1,
        opacity: 1
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
