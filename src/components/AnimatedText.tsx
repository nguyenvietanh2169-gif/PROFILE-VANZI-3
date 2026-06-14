import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Track scroll position of the paragraph element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  
  // Calculate character indices to space the reveal across the scroll progress
  let charCount = 0;
  const processedWords = words.map((word) => {
    const chars = word.split("").map((char) => {
      const index = charCount;
      charCount++;
      return { char, index };
    });
    const spaceIndex = charCount;
    charCount++;
    return { chars, spaceIndex };
  });

  const total = charCount;

  return (
    <p ref={containerRef} className={className}>
      {processedWords.map((wordInfo, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {wordInfo.chars.map(({ char, index }) => (
            <Character key={index} char={char} index={index} total={total} progress={scrollYProgress} />
          ))}
          {wIdx < words.length - 1 && (
            <Character char=" " index={wordInfo.spaceIndex} total={total} progress={scrollYProgress} />
          )}
        </span>
      ))}
    </p>
  );
};

interface CharacterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const Character: React.FC<CharacterProps> = ({ char, index, total, progress }) => {
  // Linearly distribute start and end for each character over 90% of the scroll timeline
  const start = (index / total) * 0.9;
  const end = Math.min(start + 0.1, 1.0);

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible layout placeholder */}
      <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">
        {char === " " ? "\u00A0" : char}
      </span>
      {/* Absolutely positioned animated character */}
      <motion.span
        style={{ opacity }}
        className="absolute top-0 left-0"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
};
