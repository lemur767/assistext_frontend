import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { BaseComponentProps } from '../../types';

interface TooltipProps extends BaseComponentProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 500,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        let x = rect.left + scrollX + rect.width / 2;
        let y = rect.top + scrollY;

        switch (position) {
          case 'top':
            y -= 10;
            break;
          case 'bottom':
            y += rect.height + 10;
            break;
          case 'left':
            x = rect.left + scrollX - 10;
            y += rect.height / 2;
            break;
          case 'right':
            x = rect.right + scrollX + 10;
            y += rect.height / 2;
            break;
        }

        setTooltipPosition({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'mb-2',
    bottom: 'mt-2',
    left: 'mr-2',
    right: 'ml-2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div
          className={`
            absolute z-tooltip pointer-events-none
            ${positionClasses[position]}
          `}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: position === 'top' || position === 'bottom' 
              ? 'translateX(-50%)' 
              : position === 'left' || position === 'right'
              ? 'translateY(-50%)'
              : 'none'
          }}
        >
          <div className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded px-2 py-1 whitespace-nowrap">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};