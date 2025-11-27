import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Shield, User, FileIcon, Edit, Trash2 } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    icons_count: number;
    created_at: string;
}

interface AdminUsersProps {
    users: {
        data: UserData[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Manage Users',
        href: '/admin/users',
    },
];

export default function AdminUsers({ users }: AdminUsersProps) {
    const { toast } = useToast();

    const handleEdit = (userId: number, userName: string) => {
        // Navigate to edit user page
        router.visit(`/admin/users/${userId}/edit`);
    };

    const handleDelete = (userId: number, userName: string) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            router.delete(`/admin/users/${userId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Success!',
                        description: 'User deleted successfully.',
                        variant: 'success',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to delete user.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Manage Users - Admin')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Manage Users
                        </h1>
                        <p className="text-gray-600">
                            View and manage user accounts and permissions
                        </p>
                    </div>
                    <div className="text-sm text-gray-600">
                        Total: <span className="font-semibold text-gray-900">{users.total}</span> users
                    </div>
                </div>

                {/* Users Table */}
                <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Icons
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            {/* User */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <Shield className="w-3 h-3" />
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        <User className="w-3 h-3" />
                                                        User
                                                    </span>
                                                )}
                                            </td>

                                            {/* Icons Count */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <FileIcon className="w-4 h-4" />
                                                    <span className="font-medium">{user.icons_count}</span>
                                                </div>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(user.id, user.name)}
                                                        className="border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(user.id, user.name)}
                                                        className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {users.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant="outline"
                            disabled={users.current_page === 1}
                            onClick={() => router.visit(`/admin/users?page=${users.current_page - 1}`)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </Button>
                        <span className="text-gray-600 text-sm">
                            Page {users.current_page} of {users.last_page}
                        </span>
                        <Button
                            variant="outline"
                            disabled={users.current_page === users.last_page}
                            onClick={() => router.visit(`/admin/users?page=${users.current_page + 1}`)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

