import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { dashboard, dashboardRoutes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, FileIcon, Upload, Eye } from 'lucide-react';

interface DashboardProps {
    stats: {
        my_icons: number;
        my_downloads: number;
    };
    auth: {
        user: {
            name: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats, auth }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gray-50">
                {/* Header */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-[#1b1b18] mb-2">
                        Welcome back, {auth.user.name}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's an overview of your icon collection and activity
                    </p>
                </div>

                {/* My Stats */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.visit(dashboardRoutes.myIcons().url)}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">My Icons</p>
                                        <p className="text-4xl font-bold text-gray-900">{stats.my_icons}</p>
                                        <p className="text-xs text-gray-500 mt-2">Click to view all</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FileIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Total Downloads</p>
                                        <p className="text-4xl font-bold text-gray-900">{stats.my_downloads}</p>
                                        <p className="text-xs text-gray-500 mt-2">Across all your icons</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Download className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => router.visit(dashboardRoutes.upload().url)}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Upload New Icon</h3>
                                        <p className="text-sm text-gray-600">Share your macOS-style icons</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => router.visit(dashboardRoutes.myIcons().url)}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">View My Icons</h3>
                                        <p className="text-sm text-gray-600">Manage your icon collection</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
