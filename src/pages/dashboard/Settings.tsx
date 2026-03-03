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
      <div className='ui-page-shell space-y-6'>
        <div className='ui-page-header'>
          <h1 className='ui-page-title'>Settings</h1>
          <p className='ui-page-subtitle'>
            Configure notifications, preferences, and security.
          </p>
        </div>

        <div className='ui-surface-card p-6 space-y-5'>
          <h2 className='ui-section-title'>
            Notifications & Preferences
          </h2>

          {[
            ['emailNotifications', 'Email Notifications'],
            ['weeklyDigest', 'Weekly Digest'],
            ['productUpdates', 'Product Updates'],
            ['reminderNotifications', 'Learning Reminders'],
          ].map(([key, label]) => (
            <label
              key={key}
              className='flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3'
            >
              <span className='text-[hsl(var(--foreground))] text-sm font-medium'>
                {label}
              </span>
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
            <span className='ui-field-label'>
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

        <div className='ui-surface-card p-6 space-y-4'>
          <h2 className='ui-section-title'>
            Security
          </h2>
          <label>
            <span className='ui-field-label'>Current password</span>
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
          </label>
          <label>
            <span className='ui-field-label'>New password</span>
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
          </label>
          <Button onClick={handleChangePassword} disabled={changingPassword}>
            {changingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
