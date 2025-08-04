'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface QuestionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  color: string;
  label: string;
  variant?: 'home' | 'chat';
  className?: string;
}

export const QuestionButton = ({
  onClick,
  icon: Icon,
  color,
  label,
  variant = 'home',
  className = '',
}: QuestionButtonProps) => {
  const baseClasses = "border-border hover:bg-border/30 cursor-pointer border bg-white/30 shadow-none backdrop-blur-lg active:scale-95";
  
  const variantClasses = {
    home: "aspect-square w-full rounded-2xl py-8 md:p-10",
    chat: "h-auto min-w-[110px] flex-shrink-0 rounded-xl bg-white/80 px-4 py-3 backdrop-blur-sm transition-none"
  };

  const contentClasses = {
    home: "flex h-full flex-col items-center justify-center gap-1 text-gray-700",
    chat: "flex items-center gap-3 text-gray-700"
  };

  const iconSize = variant === 'home' ? 22 : 18;
  const textClasses = variant === 'home' ? "text-xs font-medium sm:text-sm" : "text-sm font-medium";

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className={contentClasses[variant]}>
        <Icon size={iconSize} strokeWidth={2} color={color} />
        <span className={textClasses}>{label}</span>
      </div>
    </Button>
  );
};