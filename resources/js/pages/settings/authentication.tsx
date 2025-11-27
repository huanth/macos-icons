import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { formatTitle } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface AuthSettingsProps {
    google: {
        enabled: boolean;
        client_id: string;
        client_secret: string;
        redirect: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Authentication settings',
        href: '/settings/authentication',
    },
];

export default function AuthenticationSettings({ google }: AuthSettingsProps) {
    const { toast } = useToast();

    const { data, setData, post, processing, errors } = useForm({
        google_enabled: google.enabled,
        google_client_id: google.client_id || '',
        google_client_secret: google.client_secret || '',
        google_redirect: google.redirect || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/settings/authentication', {
            onSuccess: () => {
                toast({
                    title: 'Saved',
                    description: 'Authentication settings have been updated.',
                    variant: 'success',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to save settings.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Authentication Settings')} />
            <SettingsLayout>
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-[#1b1b18]">
                        Authentication Settings
                    </h1>
                    <p className="text-gray-600 mb-4 text-sm">
                        Configure social login providers for your macOS Icons platform.
                        Only admins can change these settings.
                    </p>

                    <Card className="border-gray-200 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Google Login
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="google_enabled" className="font-medium">
                                            Enable Google Login
                                        </Label>
                                        <p className="text-sm text-gray-500">
                                            Allow users to sign in or sign up using their Google
                                            account.
                                        </p>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <span className="mr-2 text-sm text-gray-700">Off</span>
                                        <div className="relative">
                                            <input
                                                id="google_enabled"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.google_enabled}
                                                onChange={(e) =>
                                                    setData('google_enabled', e.target.checked)
                                                }
                                            />
                                            <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner" />
                                            <div
                                                className={`dot absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0.5 transition ${
                                                    data.google_enabled ? 'translate-x-5' : ''
                                                }`}
                                            />
                                        </div>
                                        <span className="ml-2 text-sm text-gray-700">On</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="google_client_id">Google Client ID</Label>
                                        <Input
                                            id="google_client_id"
                                            type="text"
                                            value={data.google_client_id}
                                            onChange={(e) =>
                                                setData('google_client_id', e.target.value)
                                            }
                                            placeholder="e.g. 1234567890-abc.apps.googleusercontent.com"
                                        />
                                        {errors.google_client_id && (
                                            <p className="text-xs text-red-600">
                                                {errors.google_client_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="google_client_secret">
                                            Google Client Secret
                                        </Label>
                                        <Input
                                            id="google_client_secret"
                                            type="password"
                                            value={data.google_client_secret}
                                            onChange={(e) =>
                                                setData('google_client_secret', e.target.value)
                                            }
                                            placeholder="Your Google client secret"
                                        />
                                        {errors.google_client_secret && (
                                            <p className="text-xs text-red-600">
                                                {errors.google_client_secret}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="google_redirect">Redirect URI</Label>
                                        <Input
                                            id="google_redirect"
                                            type="text"
                                            value={data.google_redirect}
                                            onChange={(e) =>
                                                setData('google_redirect', e.target.value)
                                            }
                                            placeholder={`${window.location.origin}/auth/google/callback`}
                                        />
                                        {errors.google_redirect && (
                                            <p className="text-xs text-red-600">
                                                {errors.google_redirect}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Configure this URL in your Google Cloud Console OAuth 2.0
                                            credentials.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}


