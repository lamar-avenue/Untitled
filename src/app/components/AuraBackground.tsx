import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const AuraBackground: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      <motion.div
        style={{
          left: sx,
          top: sy,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
      >
        <div className="w-full h-full bg-blue-500/20 blur-[120px] rounded-full opacity-50" />
      </motion.div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full" />
    </div>
  );
};
