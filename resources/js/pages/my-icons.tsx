import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { dashboard, dashboardRoutes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, FileIcon, Trash2 } from 'lucide-react';

interface Icon {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    size: string | null;
    tags: string | null;
    file_path: string;
    preview_path: string | null;
    file_type: string;
    file_size: number;
    downloads: number;
    is_approved: boolean;
    created_at: string;
    file_url?: string;
    formatted_file_size?: string;
}

interface MyIconsProps {
    icons: {
        data: Icon[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'My Icons',
        href: dashboardRoutes.myIcons().url,
    },
];

export default function MyIcons({ icons }: MyIconsProps) {
    const { toast } = useToast();

    const handleDelete = (iconId: number, iconName: string) => {
        if (confirm(`Are you sure you want to delete "${iconName}"?`)) {
            router.delete(`/dashboard/my-icons/${iconId}`, {
                onSuccess: () => {
                    toast({
                        title: 'Success!',
                        description: 'Icon deleted successfully.',
                        variant: 'success',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to delete icon.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('My Icons')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gray-50">
                <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1b1b18] mb-2">
                            My Icons Collection
                        </h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            <span>Manage your uploaded macOS-style icons</span>
                            {icons.total > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {icons.total} {icons.total === 1 ? 'icon' : 'icons'}
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        onClick={() => router.visit(dashboardRoutes.upload().url)}
                        className="bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                    >
                        + Upload New Icon
                    </Button>
                </div>

                {icons.data.length === 0 ? (
                    <Card className="border-gray-200 shadow-lg bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50" />
                                <FileIcon className="w-20 h-20 text-gray-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                No icons yet
                            </h3>
                            <p className="text-gray-600 mb-8 text-center max-w-md leading-relaxed">
                                You haven't uploaded any icons yet. Start building your collection by uploading your first macOS-style icon.
                            </p>
                            <Button
                                onClick={() => router.visit(dashboardRoutes.upload().url)}
                                className="bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all px-8 py-6 text-base"
                            >
                                + Upload Your First Icon
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
                            {icons.data.map((icon) => (
                                <Card 
                                    key={icon.id} 
                                    className="border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-gray-300 group"
                                >
                                    <CardContent className="p-0">
                                        {/* Icon Preview - Smaller */}
                                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 border-b border-gray-200 relative overflow-hidden">
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-5">
                                                <div className="absolute inset-0" style={{
                                                    backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)',
                                                    backgroundSize: '15px 15px'
                                                }} />
                                            </div>
                                            
                                            {/* Icon */}
                                            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                                <img
                                                    src={icon.preview_path ? `/storage/${icon.preview_path}` : `/storage/${icon.file_path}`}
                                                    alt={icon.name}
                                                    className="max-w-full max-h-full object-contain drop-shadow-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Icon Info - Compact */}
                                        <div className="p-3 bg-white">
                                            <h3 className="font-semibold text-gray-900 truncate mb-1 text-sm">
                                                {icon.name}
                                            </h3>

                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <span className="capitalize font-medium bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                                    {icon.category}
                                                </span>
                                                <span className="text-xs">
                                                    {icon.formatted_file_size || `${Math.round(icon.file_size / 1024)} KB`}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = `/icons/${icon.slug}/download`;
                                                        link.download = `${icon.slug}.${icon.file_type}`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="flex-1 border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors h-7 text-xs"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Download
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(icon.id, icon.name)}
                                                    className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors h-7 px-2"
                                                    title="Delete icon"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {icons.last_page > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <Button
                                    variant="outline"
                                    disabled={icons.current_page === 1}
                                    onClick={() => router.visit(`/dashboard/my-icons?page=${icons.current_page - 1}`)}
                                    className="border-gray-300 hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Page {icons.current_page} of {icons.last_page}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({icons.total} total)
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    disabled={icons.current_page === icons.last_page}
                                    onClick={() => router.visit(`/dashboard/my-icons?page=${icons.current_page + 1}`)}
                                    className="border-gray-300 hover:bg-gray-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}

