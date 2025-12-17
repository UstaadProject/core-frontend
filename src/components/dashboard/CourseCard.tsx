import { Clock, PlayCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  rating: number;
  thumbnail: string;
  category: string;
}

export function CourseCard({
  title,
  instructor,
  progress,
  duration,
  rating,
  thumbnail,
  category,
}: CourseCardProps) {
  return (
    <div className='group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-primary/10 hover:shadow-lg'>
      {/* Thumbnail */}
      <div className='relative aspect-video overflow-hidden'>
        <img
          src={thumbnail}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent' />

        {/* Play button overlay */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <button className='w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-primary transform scale-90 group-hover:scale-100 transition-transform duration-300'>
            <PlayCircle className='w-7 h-7 text-primary-foreground' />
          </button>
        </div>

        {/* Category badge */}
        <span className='absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-md bg-background/80 backdrop-blur-sm text-foreground border border-border/50'>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        <div>
          <h4 className='font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors'>
            {title}
          </h4>
          <p className='text-sm text-muted-foreground mt-0.5'>{instructor}</p>
        </div>

        {/* Meta */}
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3.5 h-3.5' />
            {duration}
          </span>
          <span className='flex items-center gap-1'>
            <Star className='w-3.5 h-3.5 text-warning fill-warning' />
            {rating}
          </span>
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className='space-y-1.5'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Progress</span>
              <span className='text-primary font-medium'>{progress}%</span>
            </div>
            <div className='h-1 bg-muted rounded-full overflow-hidden'>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progress === 100 ? 'bg-success' : 'gradient-primary'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
