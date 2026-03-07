'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

interface GlassCapsuleButtonBaseProps {
  children: React.ReactNode;
  size?: Size;
  className?: string;
}

interface AsButtonProps extends GlassCapsuleButtonBaseProps {
  as?: 'button';
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

interface AsLinkProps extends GlassCapsuleButtonBaseProps {
  as: 'link';
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
}

type GlassCapsuleButtonProps = AsButtonProps | AsLinkProps;

const sizeStyles: Record<Size, string> = {
  sm: 'px-7 py-3 text-sm',
  md: 'px-10 py-4 text-base',
  lg: 'px-14 py-5 text-lg',
};

const GlassCapsuleButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GlassCapsuleButtonProps
>(({ children, size = 'md', className, ...props }, ref) => {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center',
    'rounded-[10px]',
    'bg-transparent',
    'border border-white/15',
    'text-white uppercase tracking-[0.1em] font-medium',
    'overflow-hidden',
    'transition-all duration-300 ease-out',
    'hover:border-white/30',
    'hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]',
    'cursor-pointer',
    sizeStyles[size],
    className
  );

  const shineElement = (
    <span
      className={cn(
        'absolute inset-0 z-10',
        'translate-x-[-100%]',
        'transition-transform duration-[600ms] ease-out',
        'group-hover:translate-x-[100%]'
      )}
      style={{
        background:
          'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)',
      }}
      aria-hidden="true"
    />
  );

  if (props.as === 'link') {
    const { as, href, ...rest } = props as AsLinkProps;
    return (
      <a
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={cn('group', baseClasses)}
        {...rest}
      >
        {shineElement}
        <span className="relative z-20">{children}</span>
      </a>
    );
  }

  const { as, type = 'button', onClick, disabled, ...rest } = props as AsButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group',
        baseClasses,
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
      )}
      {...rest}
    >
      {shineElement}
      <span className="relative z-20">{children}</span>
    </button>
  );
});

GlassCapsuleButton.displayName = 'GlassCapsuleButton';

export default GlassCapsuleButton;
