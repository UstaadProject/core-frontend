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
import { Loader2 } from 'lucide-react';

const defaultSettings: UserSettings = {
  emailNotifications: true,
  weeklyDigest: true,
  productUpdates: true,
  reminderNotifications: true,
  theme: 'system',
};

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
        setSettings({
          ...defaultSettings,
          ...(user.settings || {}),
        });
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
          Settings
        </h1>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-[hsl(var(--foreground))]'>
            Notifications & Preferences
          </h2>

          {[
            ['emailNotifications', 'Email Notifications'],
            ['weeklyDigest', 'Weekly Digest'],
            ['productUpdates', 'Product Updates'],
            ['reminderNotifications', 'Learning Reminders'],
          ].map(([key, label]) => (
            <label key={key} className='flex items-center justify-between'>
              <span className='text-[hsl(var(--foreground))]'>{label}</span>
              <input
                type='checkbox'
                checked={settings[key as keyof UserSettings] as boolean}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
              />
            </label>
          ))}

          <label className='block'>
            <span className='text-sm text-[hsl(var(--muted-foreground))]'>
              Theme
            </span>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, theme: e.target.value }))
              }
              className='w-full mt-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2'
            >
              <option value='system'>System</option>
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
          </label>

          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-[hsl(var(--foreground))]'>
            Security
          </h2>
          <Input
            type='password'
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            placeholder='Current password'
          />
          <Input
            type='password'
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder='New password'
          />
          <Button onClick={handleChangePassword} disabled={changingPassword}>
            {changingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
