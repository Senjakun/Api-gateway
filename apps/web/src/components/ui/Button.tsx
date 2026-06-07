import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantMap = {
    primary: 'bg-[#06b6d4] hover:bg-[#0891b2] text-white',
    secondary: 'bg-sunken hover:bg-border text-text-1',
    outline: 'border border-border hover:bg-sunken text-text-1',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon && rightIcon}
    </button>
  );
}
