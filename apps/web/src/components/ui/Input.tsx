import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-2">
        {label}
      </label>
      <input
        id={id}
        className={`bg-sunken border border-border rounded-lg px-3 py-2 text-sm text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent-light ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
