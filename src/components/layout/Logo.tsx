import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
  return (
    <Link to='/' className='flex items-center gap-3 group'>
      <div className='relative'>
        <div className='w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300'>
          <Sparkles className='w-5 h-5 text-primary-foreground' />
        </div>
        <div className='absolute inset-0 rounded-xl bg-gradient-hero opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300' />
      </div>
      <span className='text-4xl font-bold text-gradient-hero'>Ustaad</span>
    </Link>
  );
};
