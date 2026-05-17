import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getCurrentUser,
  updateCurrentUserSettings,
  type UserSettings,
} from '@/services/api/userApi';
import { changeCurrentUserPassword } from '@/services/firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Bell,
  Mail,
  BookOpen,
  Megaphone,
  Palette,
  Lock,
  Shield,
  Settings as SettingsIcon,
} from 'lucide-react';

const defaultSettings: UserSettings = {
  emailNotifications: true,
  weeklyDigest: true,
  productUpdates: true,
  reminderNotifications: true,
  theme: 'system',
};

function SettingsSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-3xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-20 w-2/5' />
        <div className='skeleton skeleton-card h-64' />
        <div className='skeleton skeleton-card h-56' />
      </div>
    </DashboardLayout>
  );
}

const toggleItems = [
  {
    key: 'emailNotifications',
    label: 'Email Notifications',
    desc: 'Get important updates via email',
    icon: Mail,
  },
  {
    key: 'weeklyDigest',
    label: 'Weekly Digest',
    desc: 'A summary of your week delivered every Monday',
    icon: Bell,
  },
  {
    key: 'productUpdates',
    label: 'Product Updates',
    desc: 'New features, improvements, and announcements',
    icon: Megaphone,
  },
  {
    key: 'reminderNotifications',
    label: 'Learning Reminders',
    desc: 'Stay on track with daily streak reminders',
    icon: BookOpen,
  },
] as const;

type ToggleKey = (typeof toggleItems)[number]['key'];

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setSettings({ ...defaultSettings, ...(user.settings || {}) });
      } catch (error) {
        toast({
          title: 'Failed to load settings',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateCurrentUserSettings(settings);
      toast({ title: 'Settings saved' });
    } catch (error) {
      toast({
        title: 'Failed to save settings',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({ title: 'Fill both password fields', variant: 'destructive' });
      return;
    }

    try {
      setChangingPassword(true);
      await changeCurrentUserPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast({ title: 'Password updated successfully' });
    } catch (error) {
      toast({
        title: 'Failed to change password',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <DashboardLayout>
      <div className='max-w-3xl mx-auto'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='flex items-center gap-4'>
            <div
              className='p-3 rounded-xl'
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))' }}
            >
              <SettingsIcon className='w-6 h-6 text-[hsl(var(--primary))]' />
            </div>
            <div>
              <h1 className='text-2xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                Settings
              </h1>
              <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                Configure notifications, preferences, and security
              </p>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-6'>
          {/* Notifications & Preferences */}
          <div className='ui-surface-card p-6 space-y-5 rounded-2xl'>
            <div className='section-header'>
              <div className='section-header-icon icon-bubble icon-bubble-primary'>
                <Bell className='w-4 h-4 text-[hsl(var(--primary))]' />
              </div>
              <div>
                <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>Notifications & Preferences</h2>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>Control what updates you receive</p>
              </div>
            </div>

            <div className='space-y-3'>
              {toggleItems.map(({ key, label, desc, icon: Icon }) => (
                <div
                  key={key}
                  className='flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-[hsl(var(--border)/0.8)] hover:bg-[hsl(var(--muted)/0.2)]'
                  style={{ background: 'hsl(var(--surface))' }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='icon-bubble icon-bubble-primary p-2'>
                      <Icon className='w-4 h-4 text-[hsl(var(--primary))]' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-[hsl(var(--foreground))]'>{label}</p>
                      <p className='text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5'>{desc}</p>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <label className='toggle-switch'>
                    <input
                      type='checkbox'
                      checked={settings[key as ToggleKey] as boolean}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                    />
                    <span className='toggle-track' />
                  </label>
                </div>
              ))}
            </div>

            {/* Theme */}
            <div className='pt-1'>
              <div className='flex items-center gap-2 mb-2'>
                <Palette className='w-4 h-4 text-[hsl(var(--accent))]' />
                <span className='ui-field-label'>Theme Preference</span>
              </div>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, theme: e.target.value }))
                }
                className='w-full rounded-xl border border-[hsl(var(--border))] px-3 py-2.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)] transition-all'
                style={{ background: 'hsl(var(--background))' }}
              >
                <option value='system'>System (auto)</option>
                <option value='light'>Light</option>
                <option value='dark'>Dark</option>
              </select>
            </div>

            <div className='pt-2'>
              <Button
                onClick={handleSaveSettings}
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
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>

          {/* Security — danger zone */}
          <div className='danger-zone-card p-6 space-y-4 rounded-2xl'>
            <div className='section-header'>
              <div
                className='section-header-icon icon-bubble'
                style={{ background: 'hsl(var(--destructive)/0.15)' }}
              >
                <Shield className='w-4 h-4 text-[hsl(var(--destructive))]' />
              </div>
              <div>
                <h2 className='font-bold text-[hsl(var(--foreground))] font-display'>Security</h2>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>Change your account password</p>
              </div>
            </div>

            <div className='space-y-3'>
              <label>
                <div className='flex items-center gap-1.5 mb-1.5'>
                  <Lock className='w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]' />
                  <span className='ui-field-label'>Current Password</span>
                </div>
                <Input
                  type='password'
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder='Enter current password'
                />
              </label>
              <label>
                <div className='flex items-center gap-1.5 mb-1.5'>
                  <Lock className='w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]' />
                  <span className='ui-field-label'>New Password</span>
                </div>
                <Input
                  type='password'
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder='Choose a strong password'
                />
              </label>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              variant='outline'
              className='border-[hsl(var(--destructive)/0.4)] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)]'
            >
              {changingPassword ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
