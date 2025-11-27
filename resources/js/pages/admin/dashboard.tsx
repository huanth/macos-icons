import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileIcon, Users, Download, FolderOpen } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_icons: number;
        total_downloads: number;
        total_users: number;
        total_categories: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
];

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Admin Dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-white">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage icons, users, and monitor platform statistics
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Icons */}
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">Total Icons</p>
                                    <p className="text-4xl font-bold text-gray-900">{stats.total_icons}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FileIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Downloads */}
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">Total Downloads</p>
                                    <p className="text-4xl font-bold text-gray-900">{stats.total_downloads}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Download className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Users */}
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">Total Users</p>
                                    <p className="text-4xl font-bold text-gray-900">{stats.total_users}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Categories */}
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">Categories</p>
                                    <p className="text-4xl font-bold text-gray-900">{stats.total_categories}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <FolderOpen className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats Summary */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/60 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Avg Downloads/Icon</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_icons > 0 
                                        ? Math.round((stats.total_downloads / stats.total_icons) * 10) / 10
                                        : 0}
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Icons per User</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_users > 0 
                                        ? Math.round((stats.total_icons / stats.total_users) * 10) / 10
                                        : 0}
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Icons per Category</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_categories > 0 
                                        ? Math.round((stats.total_icons / stats.total_categories) * 10) / 10
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

