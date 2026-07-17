import { cn } from '@/utils/cn';
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, className, children }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-[10px] font-medium tracking-[0.15em] text-warm-gray uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-warm-gray">{hint}</span>}
    </label>
  );
}

const inputClass =
  'w-full border border-stone bg-white px-3.5 py-2.5 text-sm text-charcoal transition-colors placeholder:text-warm-gray/60 focus:border-accent focus:outline-none';

export function AdminInput({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      <input className={inputClass} {...props} />
    </Field>
  );
}

export function AdminTextarea({
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea className={cn(inputClass, 'min-h-[110px] resize-y')} {...props} />
    </Field>
  );
}

export function AdminSelect({
  label,
  hint,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <select className={inputClass} {...props}>
        {children}
      </select>
    </Field>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  secondary: 'bg-charcoal text-white hover:bg-charcoal/90',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  ghost: 'text-warm-gray hover:text-charcoal hover:bg-stone/60',
  outline: 'border border-stone text-charcoal hover:border-charcoal',
};

export function AdminButton({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium tracking-[0.12em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border border-stone bg-white', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone px-5 py-4 sm:px-6">
          <div>
            {title && (
              <h2 className="text-sm font-medium tracking-tight text-charcoal">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-warm-gray">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="heading-section text-2xl text-charcoal sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-warm-gray">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Toast({
  message,
  type = 'success',
}: {
  message: string;
  type?: 'success' | 'error';
}) {
  return (
    <div
      className={cn(
        'fixed right-5 bottom-5 z-[200] px-5 py-3 text-sm text-white shadow-lg',
        type === 'success' ? 'bg-accent' : 'bg-red-700',
      )}
      role="status"
    >
      {message}
    </div>
  );
}

/** Full-screen busy state for admin saves / deletes. */
export function AdminBusyOverlay({
  show,
  label = 'Saving…',
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-charcoal/40 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 bg-white px-8 py-6 shadow-lg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-accent" />
        <p className="text-xs tracking-[0.15em] text-warm-gray uppercase">{label}</p>
      </div>
    </div>
  );
}
