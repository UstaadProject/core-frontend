import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  MailCheck,
  User,
  MapPin,
  FileText,
  Globe,
  Github,
  Linkedin,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
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

function ProfileSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-4xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-48' />
        <div className='skeleton skeleton-card h-72' />
        <div className='skeleton skeleton-card h-64' />
      </div>
    </DashboardLayout>
  );
}

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

  if (loading) return <ProfileSkeleton />;

  const initials = (form.name || user?.email || 'U').charAt(0).toUpperCase();
  const isVerified = auth.currentUser?.emailVerified;

  const formFields = [
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name', colSpan: false },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'City, Country', colSpan: false },
    { key: 'bio', label: 'Bio', icon: FileText, placeholder: 'A short bio about yourself', colSpan: true },
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://your-site.com', colSpan: false },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/username', colSpan: false },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username', colSpan: true },
  ] as const;

  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto'>
        {/* Page Banner with avatar */}
        <div className='page-banner mb-0'>
          <div className='flex items-center gap-6'>
            {/* Avatar */}
            <div className='avatar-ring shrink-0'>
              <div
                className='w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                }}
              >
                {initials}
              </div>
            </div>

            {/* Name + verification */}
            <div className='flex-1'>
              <h1 className='text-2xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                {form.name || 'Your Profile'}
              </h1>
              <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                {user?.email}
              </p>
              <div className='mt-2'>
                {isVerified ? (
                  <span className='pill pill-success text-[11px] flex items-center gap-1 w-fit'>
                    <CheckCircle2 className='w-3 h-3' /> Email verified
                  </span>
                ) : (
                  <span className='pill pill-warning text-[11px] flex items-center gap-1 w-fit'>
                    <AlertCircle className='w-3 h-3' /> Email not verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-6'>
          {/* Personal Information */}
          <div className='ui-surface-card p-6 space-y-5 rounded-2xl'>
            <div className='section-header'>
              <div className='section-header-icon icon-bubble icon-bubble-primary'>
                <User className='w-4 h-4 text-[hsl(var(--primary))]' />
              </div>
              <div>
                <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>Personal Information</h2>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>Manage your personal details</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formFields.map(({ key, label, icon: Icon, placeholder, colSpan }) => (
                <label key={key} className={colSpan ? 'md:col-span-2' : ''}>
                  <div className='flex items-center gap-1.5 mb-1.5'>
                    <Icon className='w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]' />
                    <span className='ui-field-label'>{label}</span>
                  </div>
                  <Input
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>

            <div className='pt-2'>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                  boxShadow: '0 0 16px hsl(var(--primary) / 0.3)',
                  color: 'white',
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </div>

          {/* Email & Verification */}
          <div className='ui-surface-card p-6 space-y-4 rounded-2xl'>
            <div className='section-header'>
              <div className='section-header-icon icon-bubble icon-bubble-accent'>
                <MailCheck className='w-4 h-4 text-[hsl(var(--accent))]' />
              </div>
              <div>
                <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>Email & Verification</h2>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
                  Current: <span className='text-[hsl(var(--foreground))]'>{user?.email}</span>
                </p>
              </div>
            </div>

            {!isVerified && (
              <div
                className='rounded-xl px-4 py-3 border text-sm'
                style={{
                  background: 'hsl(var(--warning)/0.08)',
                  borderColor: 'hsl(var(--warning)/0.4)',
                  color: 'hsl(var(--warning))',
                }}
              >
                Your email is not verified. Please verify it to access all features.
              </div>
            )}

            <Button variant='outline' onClick={handleVerifyEmail} className='flex items-center gap-2'>
              <MailCheck className='w-4 h-4' />
              Send verification email
            </Button>

            <div className='border-t border-[hsl(var(--border))] pt-4 space-y-3'>
              <p className='text-sm font-semibold text-[hsl(var(--foreground))]'>Change Email</p>
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='New email address'
              />
              <Input
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder='Current password (required)'
              />
              <Button
                onClick={handleChangeEmail}
                disabled={emailChanging}
                variant='outline'
              >
                {emailChanging ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Change Email'
                )}
              </Button>
            </div>
          </div>

          {/* Security placeholder */}
          <div className='ui-surface-card p-6 rounded-2xl'>
            <div className='section-header'>
              <div className='section-header-icon icon-bubble' style={{ background: 'hsl(var(--success)/0.15)' }}>
                <Shield className='w-4 h-4 text-[hsl(var(--success))]' />
              </div>
              <div>
                <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>Account Security</h2>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
                  Change password and manage access
                </p>
              </div>
            </div>
            <p className='text-sm text-[hsl(var(--muted-foreground))]'>
              Visit <span className='text-[hsl(var(--primary))]'>Settings → Security</span> to update your password.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
