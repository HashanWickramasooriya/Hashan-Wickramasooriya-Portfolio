'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/lib/useMagnetic';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ArrowRightIcon } from './icons';

type Variant = 'primary' | 'secondary';

/** Several native DOM event handlers collide with Framer Motion's own prop signatures; none are needed here. */
type MotionSafe<T> = Omit<
  T,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'className'
  | 'children'
>;

interface ButtonBaseProps {
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  MotionSafe<ButtonHTMLAttributes<HTMLButtonElement>> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  MotionSafe<AnchorHTMLAttributes<HTMLAnchorElement>> & { href: string };

const baseClasses =
  'ease-swift relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium select-none transition-shadow duration-300';

const variantClasses: Record<Variant, string> = {
  primary:
    'from-accent to-accent-secondary text-accent-foreground bg-linear-to-r shadow-[var(--shadow-glow-sm)] hover:shadow-[var(--shadow-glow-md)]',
  secondary:
    'text-foreground border border-white/15 bg-white/[0.02] backdrop-blur-sm hover:border-accent/60 hover:bg-accent-soft hover:text-accent-secondary',
};

const rippleColor: Record<Variant, string> = {
  primary: 'bg-white/35',
  secondary: 'bg-accent/25',
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

function ButtonContent({
  variant,
  showArrow,
  children,
}: Pick<ButtonBaseProps, 'variant' | 'showArrow' | 'children'>) {
  return (
    <>
      {variant === 'primary' && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15"
          />
          <motion.span
            aria-hidden="true"
            initial={{ x: '-130%' }}
            whileHover={{ x: '130%' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-white/20"
          />
        </>
      )}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowRightIcon className="ease-swift relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );
}

function useRipple(variant: Variant, reducedMotion: boolean) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function trigger(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = Date.now();
    setRipples((current) => [
      ...current,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top, size },
    ]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 650);
  }

  const layer = (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn('pointer-events-none absolute rounded-full', rippleColor[variant])}
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </AnimatePresence>
  );

  return { trigger, layer };
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', showArrow = true, className, children, ...rest } = props;
  const reducedMotion = useReducedMotion();
  const {
    ref: anchorRef,
    x: anchorX,
    y: anchorY,
    handlePointerMove: handleAnchorPointerMove,
    handlePointerLeave: handleAnchorPointerLeave,
  } = useMagnetic<HTMLAnchorElement>(0.2);
  const {
    ref: buttonRef,
    x: buttonX,
    y: buttonY,
    handlePointerMove: handleButtonPointerMove,
    handlePointerLeave: handleButtonPointerLeave,
  } = useMagnetic<HTMLButtonElement>(0.2);
  const anchorRipple = useRipple(variant, reducedMotion);
  const buttonRipple = useRipple(variant, reducedMotion);
  const classes = cn(baseClasses, variantClasses[variant], 'group', className);

  const hoverAnimation = {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.97, y: 0 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  };

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as MotionSafe<AnchorHTMLAttributes<HTMLAnchorElement>> & {
      href: string;
    };
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        className={classes}
        style={{ x: anchorX, y: anchorY }}
        onPointerMove={handleAnchorPointerMove}
        onPointerDown={anchorRipple.trigger}
        onPointerLeave={handleAnchorPointerLeave}
        {...hoverAnimation}
        {...anchorRest}
      >
        {anchorRipple.layer}
        <ButtonContent variant={variant} showArrow={showArrow}>
          {children}
        </ButtonContent>
      </motion.a>
    );
  }

  const buttonRest = rest as MotionSafe<ButtonHTMLAttributes<HTMLButtonElement>>;
  return (
    <motion.button
      ref={buttonRef}
      type={buttonRest.type ?? 'button'}
      className={classes}
      style={{ x: buttonX, y: buttonY }}
      onPointerMove={handleButtonPointerMove}
      onPointerDown={buttonRipple.trigger}
      onPointerLeave={handleButtonPointerLeave}
      {...hoverAnimation}
      {...buttonRest}
    >
      {buttonRipple.layer}
      <ButtonContent variant={variant} showArrow={showArrow}>
        {children}
      </ButtonContent>
    </motion.button>
  );
}
