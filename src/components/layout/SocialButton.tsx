import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <Button
      variant='outline'
      className='w-full h-11 gap-3 bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50'
      onClick={onClick}
    >
      {icon}
      <span className='text-muted-foreground'>{label}</span>
    </Button>
  );
};
