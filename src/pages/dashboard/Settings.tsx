import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-20 w-2/5 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-56 animate-pulse rounded-2xl bg-muted" />
      </div>
    </DashboardLayout>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

const toggleItems = [
  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get important updates via email', icon: Mail },
  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A summary of your week every Monday', icon: Bell },
  { key: 'productUpdates', label: 'Product Updates', desc: 'New features and announcements', icon: Megaphone },
  { key: 'reminderNotifications', label: 'Learning Reminders', desc: 'Daily streak reminders to stay on track', icon: BookOpen },
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
    (async () => {
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
    })();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateCurrentUserSettings(settings);
      toast({ title: 'Settings saved' });
    } catch (error) {
      toast({
        title: 'Failed to save settings',
        description: error instanceof Error ? error.message : 'Please try again',
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
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Settings
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Notifications, preferences and security.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="font-display font-bold">Notifications & Preferences</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Control what updates you receive.
              </p>
            </div>

            <div className="space-y-3">
              {toggleItems.map(({ key, label, desc, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={settings[key as ToggleKey] as boolean}
                    onChange={(v) =>
                      setSettings((prev) => ({ ...prev, [key]: v }))
                    }
                  />
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Palette className="size-4 text-info" />
                <span className="text-xs font-medium text-muted-foreground">
                  Theme Preference
                </span>
              </div>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, theme: e.target.value }))
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="system">System (auto)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-destructive/30">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <Shield className="size-4" />
              </div>
              <div>
                <h2 className="font-display font-bold">Security</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Change your account password.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Current Password
                  </span>
                </div>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
              </label>
              <label className="block">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    New Password
                  </span>
                </div>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Choose a strong password"
                />
              </label>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
