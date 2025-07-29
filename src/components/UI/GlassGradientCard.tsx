import React, { useState, useRef } from 'react';

type GlowVariant = 'brand' | 'secondary' | 'accent' | 'grey' | 'orange';
type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';
type BlurVariant = 'light' | 'medium' | 'heavy';
type AnimationVariant = 'glow' | 'pulse' | 'shimmer' | 'bounce' | 'scale' | 'ripple' | 'wave';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

interface GlassGradProps {
  children: React.ReactNode;
  className?: string;
  glow?: GlowVariant;
  size?: SizeVariant;
  blur?: BlurVariant;
  animation?: AnimationVariant;
  noBorder?: boolean;
  onClick?: () => void;
}

export function GlassGradCard({ 
  children, 
  className = '',
  glow = 'brand',
  size = 'md',
  blur = 'medium',
  animation = 'glow',
  noBorder = false,
  onClick
}: GlassGradProps) {
  
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const glowColors = {
    brand: 'from-secondary-600 via-secondary-300 to-accent-600',
    secondary: 'from-secondary-400 via-secondary-500 to-secondary-600',
    accent: 'from-accent-400 via-accent-500 to-accent-600',
    grey: 'from-black-400 via-black-200 to-grey-800',
    orange: 'from-orange-400 via-orange-500 to-orange-600',
    
  };

  const sizeClasses = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl',
    xl: 'p-10 rounded-3xl'
  };

  const blurClasses = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-lg',
    heavy: 'backdrop-blur-2xl'
  };

  const animationClasses = {
    glow: 'animate-pulse',
    pulse: 'animate-pulse',
    shimmer: 'animate-bounce',
    bounce: 'animate-bounce',
    scale: 'group-hover:animate-pulse',
    ripple: '',
    wave: ''
  };

  const getTransformClass = () => {
    switch (animation) {
      case 'scale':
        return 'group-hover:scale-105';
      case 'bounce':
        return 'group-hover:-translate-y-1';
      default:
        return '';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
    }

    if (animation === 'ripple' && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 1000);
    }

    if (animation === 'wave') {
      setIsWaveActive(true);
      setTimeout(() => setIsWaveActive(false), 1500);
    }
  };

  const isClickable = animation === 'ripple' || animation === 'wave' || onClick;

  return (
    <div className={`group relative ${className}`}>
      {/* Outer glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r hover:${glowColors[glow]} rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 hover:${animationClasses[animation]}`} />
      
      {/* Middle glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r hover:${glowColors[glow]} rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
      
      {/* Main card */}
      <div 
        ref={cardRef}
        className={`relative ${blurClasses[blur]} bg-white/10 dark:bg-black/10 ${!noBorder ? 'border border-white/20 dark:border-white/10' : ''} ${sizeClasses[size]} shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white/15 dark:group-hover:bg-black/15 ${getTransformClass()} ${isClickable ? 'cursor-pointer' : ''} overflow-hidden`}
        onClick={isClickable ? handleClick : undefined}
      >
        {/* Inner glow border */}
        {!noBorder && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-50" />
        )}
        
        {/* Shimmer effect for shimmer variant */}
        {animation === 'shimmer' && (
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
        )}

        {/* Ripple effects */}
        {animation === 'ripple' && ripples.map((ripple) => (
          <div
            key={ripple.id}
            className={`absolute pointer-events-none animate-ripple bg-gradient-to-r ${glowColors[glow]} rounded-full opacity-30`}
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px'
            }}
          />
        ))}

        {/* Wave effect */}
        {animation === 'wave' && (
          <>
            <div className={`absolute inset-0 bg-gradient-to-r ${glowColors[glow]} opacity-20 ${isWaveActive ? 'animate-wave-1' : ''}`} />
            <div className={`absolute inset-0 bg-gradient-to-l ${glowColors[glow]} opacity-15 ${isWaveActive ? 'animate-wave-2' : ''}`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${glowColors[glow]} opacity-10 ${isWaveActive ? 'animate-wave-3' : ''}`} />
          </>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}