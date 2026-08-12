import { ButtonHTMLAttributes, forwardRef } from 'react';

// Styling values below (padding, radius, colors) are placeholders using
// the theme tokens from globals.css — sizes/variants will likely need
// adjustment once I see actual button styles from the Figma screenshots.

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary: 'bg-surface text-foreground border border-border hover:bg-muted',
  danger: 'bg-danger text-white hover:opacity-90',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

// forwardRef so this can be used with things like radix-style focus
// management or form libraries later without needing to change the
// component itself — cheap to add now, occasionally needed later.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center rounded-md font-medium
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
