import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  to?: undefined;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  to?: undefined;
  type?: undefined;
  onClick?: undefined;
}

interface ButtonAsRouterLink extends ButtonBaseProps {
  to: string;
  href?: undefined;
  type?: undefined;
  onClick?: undefined;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  secondary: 'bg-charcoal text-white hover:bg-charcoal/90',
  outline: 'border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white',
  ghost: 'text-charcoal hover:text-accent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-xs tracking-widest uppercase',
  md: 'px-7 py-3.5 text-xs tracking-widest uppercase',
  lg: 'px-9 py-4 text-sm tracking-widest uppercase',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if ('to' in props && props.to) {
    const { to, ...rest } = props as ButtonAsRouterLink;
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = 'button', onClick, disabled } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
