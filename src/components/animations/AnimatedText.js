import { motion } from 'framer-motion';

const AnimatedText = ({ text, className = '', delay = 0, type = 'word' }) => {
  const words = text.split(' ');
  const chars = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'word' ? 0.08 : 0.03,
        delayChildren: delay
      }
    }
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (type === 'word') {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
