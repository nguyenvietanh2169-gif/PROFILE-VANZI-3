import React, { useRef, useEffect } from 'react';

interface MagnetWithPendantProps {
  padding?: number;
  strength?: number;
  className?: string;
}

export const MagnetWithPendant: React.FC<MagnetWithPendantProps> = ({
  padding = 150,
  strength = 3,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLImageElement>(null);
  const pendantRef = useRef<HTMLImageElement>(null);

  // Easing values stored in refs to bypass React rendering cycles for 60fps/120fps performance
  const targetX = useRef(0);
  const targetY = useRef(0);
  const headX = useRef(0);
  const headY = useRef(0);
  const pendantX = useRef(0);
  const pendantY = useRef(0);

  // Gyroscope tracking refs
  const gyroX = useRef(0);
  const gyroY = useRef(0);
  const isTouching = useRef(false);

  // Request gyroscope/deviceorientation permission on iOS
  const requestGyroPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof DeviceOrientationEvent !== 'undefined' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          console.log('DeviceOrientation permission granted');
        }
      } catch (error) {
        console.warn('DeviceOrientation permission request failed:', error);
      }
    }
  };

  // 1. Mouse Move Event Handler (Desktop)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;

      // Determine if cursor is within padding bounding box
      const isWithinPadding =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (isWithinPadding) {
        targetX.current = distanceX / strength;
        targetY.current = distanceY / strength;
      } else {
        targetX.current = 0;
        targetY.current = 0;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, strength]);

  // 2. Touch Move Event Handler (Mobile responsiveness)
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isTouching.current = true;
      const touch = e.touches[0];
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const distanceX = touch.clientX - elementCenterX;
      const distanceY = touch.clientY - elementCenterY;

      const isWithinPadding =
        touch.clientX >= rect.left - padding &&
        touch.clientX <= rect.right + padding &&
        touch.clientY >= rect.top - padding &&
        touch.clientY <= rect.bottom + padding;

      if (isWithinPadding) {
        targetX.current = distanceX / strength;
        targetY.current = distanceY / strength;
      } else {
        targetX.current = 0;
        targetY.current = 0;
      }
    };

    const handleTouchEnd = () => {
      isTouching.current = false;
      targetX.current = 0;
      targetY.current = 0;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [padding, strength]);

  // 3. Gyroscope/DeviceOrientation Event Handler (Mobile tilt movement)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // holding phone naturally is tilted at 45 to 70 degrees
      const baselineBeta = 55;
      const tiltX = e.gamma; 
      const tiltY = e.beta - baselineBeta;

      // Clamp max tilts to prevent excessive shifting
      const maxTilt = 22;
      const clampedX = Math.max(-maxTilt, Math.min(maxTilt, tiltX));
      const clampedY = Math.max(-maxTilt, Math.min(maxTilt, tiltY));

      // Multiply by a factor for comfortable responsiveness
      gyroX.current = clampedX * 1.6;
      gyroY.current = clampedY * 1.6;
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // 4. Animation Loop (Handles Easing, Lag/Delay, and Mobile Idle/Gyro Floating)
  useEffect(() => {
    let animId: number;
    let time = 0;

    const tick = () => {
      time += 0.02;

      let currentTargetX: number;
      let currentTargetY: number;

      if (isTouching.current) {
        // Finger dragging on mobile
        currentTargetX = targetX.current;
        currentTargetY = targetY.current;
      } else if (gyroX.current !== 0 || gyroY.current !== 0) {
        // Phone tilting via Gyroscope
        currentTargetX = gyroX.current;
        currentTargetY = gyroY.current;
      } else if (targetX.current !== 0 || targetY.current !== 0) {
        // Mouse hover on desktop
        currentTargetX = targetX.current;
        currentTargetY = targetY.current;
      } else {
        // Idle floating (desktop/mobile when stationary)
        currentTargetX = Math.sin(time * 0.8) * 4;
        currentTargetY = Math.cos(time * 1.2) * 7;
      }

      // Easing calculation for the head
      headX.current += (currentTargetX - headX.current) * 0.12;
      headY.current += (currentTargetY - headY.current) * 0.12;

      // Easing calculation for the pendant (slower coefficient = lag/delay)
      pendantX.current += (headX.current - pendantX.current) * 0.065;
      pendantY.current += (headY.current - pendantY.current) * 0.065;

      // Direct DOM manipulation of CSS transforms for peak hardware acceleration
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${headX.current}px, ${headY.current}px, 0px)`;
      }
      if (pendantRef.current) {
        pendantRef.current.style.transform = `translate3d(${pendantX.current}px, ${pendantY.current}px, 0px)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onClick={requestGyroPermission}
      onTouchStart={() => {
        isTouching.current = true;
        requestGyroPermission();
      }}
      onTouchEnd={() => {
        isTouching.current = false;
      }}
    >
      {/* 1. Main Head Portrait (Stays as original, biting the chain) */}
      <img
        ref={headRef}
        src="/vanzi-head.png"
        alt="Vanzi Portrait"
        className="w-full h-auto object-contain select-none pointer-events-none"
        draggable="false"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Eased Follow Pendant (Positioned under the chin) */}
      <img
        ref={pendantRef}
        src="/vanzi-pendant-new.png"
        alt="Vanzi Pendant"
        className="absolute select-none pointer-events-none"
        draggable="false"
        style={{
          left: '32%',
          top: '81%',
          width: '38%',
          height: 'auto',
          filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.6))',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
