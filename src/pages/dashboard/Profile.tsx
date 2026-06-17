import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </DashboardLayout>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  tone = 'primary',
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  tone?: 'primary' | 'info' | 'success';
  children: React.ReactNode;
}) {
  const toneMap = {
    primary: 'bg-primary/10 text-primary',
    info: 'bg-info/12 text-info',
    success: 'bg-success/12 text-success',
  } as const;
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center gap-3">
          <div className={cn('grid size-9 place-items-center rounded-xl', toneMap[tone])}>
            <Icon className="size-4" />
          </div>
          <div>
            <h2 className="font-display font-bold">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
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
    (async () => {
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
    })();
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
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendCurrentUserVerificationEmail();
      toast({ title: 'Verification email sent', description: 'Check your inbox.' });
    } catch (error) {
      toast({
        title: 'Unable to send verification email',
        description: error instanceof Error ? error.message : 'Please try again',
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
        description: error instanceof Error ? error.message : 'Please try again',
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
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name', wide: false },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'City, Country', wide: false },
    { key: 'bio', label: 'Bio', icon: FileText, placeholder: 'A short bio about yourself', wide: true },
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://your-site.com', wide: false },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/username', wide: false },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username', wide: true },
  ] as const;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
        {/* Header card */}
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-[oklch(0.5_0.12_205)] text-primary-foreground">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-white/20 font-display text-3xl font-extrabold ring-4 ring-white/15">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-extrabold">
                {form.name || 'Your Profile'}
              </h1>
              <p className="mt-0.5 truncate text-sm text-primary-foreground/80">
                {user?.email}
              </p>
              <div className="mt-2">
                {isVerified ? (
                  <Badge className="border-none bg-white/20 text-primary-foreground">
                    <CheckCircle2 className="size-3.5" /> Email verified
                  </Badge>
                ) : (
                  <Badge className="border-none bg-white/20 text-primary-foreground">
                    <AlertCircle className="size-3.5" /> Not verified
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Section
          icon={User}
          title="Personal Information"
          subtitle="Manage your personal details"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formFields.map(({ key, label, icon: Icon, placeholder, wide }) => (
              <label key={key} className={wide ? 'md:col-span-2' : ''}>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                </div>
                <Input
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                />
              </label>
            ))}
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </Section>

        {/* Email */}
        <Section
          icon={MailCheck}
          title="Email & Verification"
          subtitle={`Current: ${user?.email}`}
          tone="info"
        >
          {!isVerified && (
            <div className="rounded-xl border border-streak/40 bg-streak/10 px-4 py-3 text-sm text-streak">
              Your email is not verified. Please verify it to access all features.
            </div>
          )}
          <Button variant="outline" onClick={handleVerifyEmail}>
            <MailCheck className="size-4" />
            Send verification email
          </Button>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm font-semibold">Change Email</p>
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email address"
            />
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password (required)"
            />
            <Button onClick={handleChangeEmail} disabled={emailChanging} variant="outline">
              {emailChanging ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                'Change Email'
              )}
            </Button>
          </div>
        </Section>

        {/* Security pointer */}
        <Section icon={Shield} title="Account Security" tone="success">
          <p className="text-sm text-muted-foreground">
            Visit <span className="font-medium text-primary">Settings → Security</span>{' '}
            to update your password.
          </p>
        </Section>
      </div>
    </DashboardLayout>
  );
}
