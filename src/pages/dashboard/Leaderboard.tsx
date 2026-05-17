import { useEffect, useRef, useState } from 'react';
import { Trophy, Flame, Zap, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  getLeaderboard,
  type LeaderboardUser,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

function LeaderboardSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-20 w-2/5' />
        <div className='grid grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => <div key={i} className='skeleton skeleton-card h-56' />)}
        </div>
        <div className='skeleton skeleton-card h-96' />
      </div>
    </DashboardLayout>
  );
}

const medalColors = [
  { label: '#1', bg: 'rank-gold', glow: 'rgba(245,158,11,0.4)', podiumH: 'h-40' },
  { label: '#2', bg: 'rank-silver', glow: 'rgba(148,163,184,0.3)', podiumH: 'h-32' },
  { label: '#3', bg: 'rank-bronze', glow: 'rgba(205,127,50,0.3)', podiumH: 'h-28' },
];

// Podium order: 2nd, 1st, 3rd
const podiumOrder = [1, 0, 2];

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

  if (loading) return <LeaderboardSkeleton />;

  const topThree = users.slice(0, 3);

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center gap-4 mb-2'>
              <div
                className='p-3 rounded-xl'
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))' }}
              >
                <Trophy className='w-7 h-7 animate-trophy' style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h1 className='text-3xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                  Leaderboard
                </h1>
                <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                  Compete with learners based on XP, streaks, and learning progress
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          {/* Podium */}
          {topThree.length >= 3 && (
            <div className='flex items-end justify-center gap-4 mb-2'>
              {podiumOrder.map((rank) => {
                const user = topThree[rank];
                if (!user) return null;
                const medal = medalColors[rank];
                const isFirst = rank === 0;

                return (
                  <div
                    key={user.email}
                    className={`flex flex-col items-center gap-3 animate-slide-up`}
                    style={{ animationDelay: `${rank * 0.1}s` }}
                  >
                    {/* User card */}
                    <div
                      className={`relative border rounded-2xl p-5 w-44 text-center transition-all hover:scale-[1.03] ${
                        rank === 0 ? 'podium-1' : rank === 1 ? 'podium-2' : 'podium-3'
                      }`}
                      style={{
                        boxShadow: `0 8px 32px ${medal.glow}`,
                        border: `1px solid ${medal.glow}`,
                      }}
                    >
                      {isFirst && (
                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce-subtle'>
                          👑
                        </div>
                      )}
                      {/* Avatar */}
                      <div
                        className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-xl font-extrabold mb-3 ${medal.bg}`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p className='font-bold text-[hsl(var(--foreground))] text-sm truncate'>
                        {user.name}
                      </p>
                      <div className='flex items-center justify-center gap-1 mt-1.5'>
                        <Zap className='w-3.5 h-3.5 text-[hsl(var(--accent))]' />
                        <span className='text-[hsl(var(--accent))] font-bold text-sm'>
                          {user.xp.toLocaleString()} XP
                        </span>
                      </div>
                      <div className='flex items-center justify-center gap-2 mt-2 text-[11px] text-[hsl(var(--muted-foreground))]'>
                        <span className='flex items-center gap-0.5'>
                          <Flame className='w-3 h-3' /> {user.streakDays}d
                        </span>
                        <span>·</span>
                        <span className='flex items-center gap-0.5'>
                          <Clock className='w-3 h-3' /> {Math.round(user.hoursLearned)}h
                        </span>
                      </div>
                    </div>

                    {/* Podium block */}
                    <div
                      className={`w-44 ${medal.podiumH} rounded-t-xl flex items-center justify-center font-extrabold text-2xl text-white ${medal.bg}`}
                    >
                      {medal.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Rankings Table */}
          <div
            className='rounded-2xl overflow-hidden border border-[hsl(var(--border))]'
            style={{ background: 'hsl(var(--card))' }}
          >
            <div
              className='px-6 py-4 border-b border-[hsl(var(--border))]'
              style={{ background: 'hsl(var(--surface))' }}
            >
              <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>
                Full Rankings
              </h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full premium-table'>
                <thead>
                  <tr className='text-left'>
                    {['Rank', 'Learner', 'XP', 'Streak', 'Skills', 'Hours', 'Modules'].map((h) => (
                      <th
                        key={h}
                        className='px-5 py-3.5 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr
                      key={user.email}
                      className='animate-slide-up'
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className='px-5 py-3.5'>
                        <span
                          className={`pill text-[11px] font-bold ${
                            user.rank === 1
                              ? 'rank-gold'
                              : user.rank === 2
                                ? 'rank-silver'
                                : user.rank === 3
                                  ? 'rank-bronze'
                                  : 'pill-primary'
                          }`}
                          style={{ borderRadius: '9999px', padding: '2px 8px' }}
                        >
                          #{user.rank}
                        </span>
                      </td>
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center gap-2.5'>
                          <div
                            className='w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0'
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className='font-semibold text-sm text-[hsl(var(--foreground))]'>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className='px-5 py-3.5'>
                        <span className='pill pill-accent text-[11px]'>
                          ⚡ {user.xp.toLocaleString()}
                        </span>
                      </td>
                      <td className='px-5 py-3.5'>
                        <span className='text-sm text-[hsl(var(--foreground))]'>
                          🔥 {user.streakDays}d
                        </span>
                      </td>
                      <td className='px-5 py-3.5 text-sm text-[hsl(var(--foreground))]'>
                        {user.skillsMastered}
                      </td>
                      <td className='px-5 py-3.5 text-sm text-[hsl(var(--foreground))]'>
                        {Math.round(user.hoursLearned)}h
                      </td>
                      <td className='px-5 py-3.5 text-sm text-[hsl(var(--foreground))]'>
                        {user.modulesCompleted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
