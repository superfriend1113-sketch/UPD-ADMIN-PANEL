/**
 * Button Component
 * UPD Design System - Reusable button with variants
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center gap-[7px] rounded-[6px] font-semibold cursor-pointer border-none transition-all duration-150 tracking-[0.2px] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantStyles = {
    primary: 'bg-[#0d0d0d] text-white hover:bg-[#2a2a2a] hover:-translate-y-[1px]',
    secondary: 'bg-transparent text-[#0d0d0d] border-[1.5px] border-[#d6d0c4] hover:border-[#0d0d0d]',
    danger: 'bg-[#c8401a] text-white hover:bg-[#a83416]',
    success: 'bg-[#1e8a52] text-white hover:bg-[#167343]',
  };

  const sizeStyles = {
    sm: 'px-[14px] py-[6px] text-[12px]',
    md: 'px-[22px] py-[10px] text-[14px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
