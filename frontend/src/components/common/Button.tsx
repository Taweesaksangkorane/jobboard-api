import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-2.5 rounded-xl gap-2.5 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#6C4CE3] text-white hover:bg-[#5638C5] shadow-xs hover:shadow-md focus:ring-[#6C4CE3]',
    secondary:
      'bg-[#4776E6] text-white hover:bg-blue-600 shadow-xs hover:shadow-md focus:ring-[#4776E6]',
    outline:
      'border border-[#E9EAF1] bg-white text-[#25243A] hover:bg-gray-50 hover:border-gray-300 focus:ring-purple-200',
    danger:
      'bg-[#E05252] text-white hover:bg-red-600 focus:ring-red-400',
    ghost:
      'bg-transparent text-[#73758A] hover:bg-gray-100 hover:text-[#25243A]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
