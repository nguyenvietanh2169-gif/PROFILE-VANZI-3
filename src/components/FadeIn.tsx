import React from 'react';
import { motion } from 'framer-motion';

const motionElements = {
  div: motion.div,
  nav: motion.nav,
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
  span: motion.span,
  section: motion.section,
  footer: motion.footer,
};

type MotionTag = keyof typeof motionElements;

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: MotionTag;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
}) => {
  const MotionComponent = motionElements[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};
