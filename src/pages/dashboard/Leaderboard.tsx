import { useEffect, useRef, useState } from 'react';
import { Trophy, Flame, Zap, Clock, Loader2, Medal } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getLeaderboard, type LeaderboardUser } from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setUsers(data);
      } catch (error) {
        toast({
          title: 'Failed to load leaderboard',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Loading leaderboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const topThree = users.slice(0, 3);

  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-[hsl(var(--foreground))] flex items-center gap-3'>
            <Trophy className='w-8 h-8 text-[hsl(var(--primary))]' />
            Leaderboard
          </h1>
          <p className='text-[hsl(var(--muted-foreground))] mt-2'>
            Compete with learners based on streaks, XP, and learning progress.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          {topThree.map((user, index) => (
            <div
              key={user.email}
              className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-5'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Medal className='w-5 h-5 text-[hsl(var(--primary))]' />
                  <span className='font-semibold text-[hsl(var(--foreground))]'>
                    #{index + 1}
                  </span>
                </div>
                <span className='text-xs px-2 py-1 rounded-full bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]'>
                  Top Performer
                </span>
              </div>
              <h3 className='text-lg font-semibold text-[hsl(var(--foreground))]'>
                {user.name}
              </h3>
              <div className='space-y-2 mt-4 text-sm'>
                <p className='flex items-center gap-2 text-[hsl(var(--muted-foreground))]'>
                  <Zap className='w-4 h-4' /> {user.xp} XP
                </p>
                <p className='flex items-center gap-2 text-[hsl(var(--muted-foreground))]'>
                  <Flame className='w-4 h-4' /> {user.streakDays} day streak
                </p>
                <p className='flex items-center gap-2 text-[hsl(var(--muted-foreground))]'>
                  <Clock className='w-4 h-4' /> {Math.round(user.hoursLearned)} hours
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden'>
          <div className='p-4 border-b border-[hsl(var(--border))]'>
            <h2 className='font-semibold text-[hsl(var(--foreground))]'>
              Full Rankings
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-left border-b border-[hsl(var(--border))]'>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Rank
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Learner
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    XP
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Streak
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Skills
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Hours
                  </th>
                  <th className='px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Modules
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className='border-b border-[hsl(var(--border)/0.6)]'>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))] font-semibold'>
                      #{user.rank}
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {user.name}
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {user.xp}
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {user.streakDays} days
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {user.skillsMastered}
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {Math.round(user.hoursLearned)}
                    </td>
                    <td className='px-4 py-3 text-[hsl(var(--foreground))]'>
                      {user.modulesCompleted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
