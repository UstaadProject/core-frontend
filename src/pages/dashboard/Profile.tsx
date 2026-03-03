import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MailCheck } from 'lucide-react';
import {
  getCurrentUser,
  updateCurrentUserProfile,
  type CurrentUserResponse,
} from '@/services/api/userApi';
import {
  auth,
  sendCurrentUserVerificationEmail,
  changeCurrentUserEmail,
} from '@/services/firebase/firebase';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailChanging, setEmailChanging] = useState(false);
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
  });
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setUser(data);
        setForm({
          name: data.name || '',
          bio: data.profile?.bio || '',
          location: data.profile?.location || '',
          website: data.profile?.website || '',
          github: data.profile?.github || '',
          linkedin: data.profile?.linkedin || '',
        });
        setNewEmail(data.email || '');
      } catch (error) {
        toast({
          title: 'Failed to load profile',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [toast]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateCurrentUserProfile({
        name: form.name,
        profile: {
          bio: form.bio,
          location: form.location,
          website: form.website,
          github: form.github,
          linkedin: form.linkedin,
        },
      });
      setUser(updated);
      toast({ title: 'Profile updated successfully' });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendCurrentUserVerificationEmail();
      toast({
        title: 'Verification email sent',
        description: 'Check your inbox.',
      });
    } catch (error) {
      toast({
        title: 'Unable to send verification email',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleChangeEmail = async () => {
    if (!currentPassword.trim()) {
      toast({ title: 'Current password is required', variant: 'destructive' });
      return;
    }

    try {
      setEmailChanging(true);
      await changeCurrentUserEmail(currentPassword, newEmail.trim());
      toast({
        title: 'Email updated',
        description: 'A verification email has been sent to your new address.',
      });
      setCurrentPassword('');
    } catch (error) {
      toast({
        title: 'Failed to update email',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setEmailChanging(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='p-8 max-w-4xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold text-[hsl(var(--foreground))]'>
          Profile
        </h1>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-[hsl(var(--foreground))]'>
            Personal Information
          </h2>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder='Full name'
          />
          <Input
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
            placeholder='Location'
          />
          <Input
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder='Bio'
          />
          <Input
            value={form.website}
            onChange={(e) =>
              setForm((p) => ({ ...p, website: e.target.value }))
            }
            placeholder='Website'
          />
          <Input
            value={form.github}
            onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))}
            placeholder='GitHub'
          />
          <Input
            value={form.linkedin}
            onChange={(e) =>
              setForm((p) => ({ ...p, linkedin: e.target.value }))
            }
            placeholder='LinkedIn'
          />
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-[hsl(var(--foreground))]'>
            Email & Verification
          </h2>
          <div className='text-sm text-[hsl(var(--muted-foreground))]'>
            Current email: {user?.email}
          </div>
          <div className='text-sm'>
            {auth.currentUser?.emailVerified ? (
              <span className='text-[hsl(var(--success))]'>Email verified</span>
            ) : (
              <span className='text-[hsl(var(--destructive))]'>
                Email not verified
              </span>
            )}
          </div>
          <Button variant='outline' onClick={handleVerifyEmail}>
            <MailCheck className='w-4 h-4 mr-2' />
            Send verification email
          </Button>

          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder='New email'
          />
          <Input
            type='password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder='Current password (required to change email)'
          />
          <Button onClick={handleChangeEmail} disabled={emailChanging}>
            {emailChanging ? 'Updating...' : 'Change Email'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
