import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, Calendar, User, Tag, FileIcon } from 'lucide-react';
import { useState } from 'react';

interface IconDetail {
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
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface IconDetailProps {
    icon: IconDetail;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Icon Detail',
        href: '#',
    },
];

export default function IconDetail({ icon }: IconDetailProps) {
    const [downloadCount, setDownloadCount] = useState(icon.downloads);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `/icons/${icon.slug}/download`;
        link.download = `${icon.slug}.${icon.file_type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update count optimistically
        setDownloadCount(prev => prev + 1);
    };

    const getFileSize = (bytes: number) => {
        if (bytes >= 1048576) {
            return (bytes / 1048576).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        }
        return bytes + ' B';
    };

    const categoryName = icon.category.charAt(0).toUpperCase() + icon.category.slice(1);
    const metaDescription = icon.description 
        ? `${icon.description.substring(0, 160)}...`
        : `Download ${icon.name} - ${categoryName} icon for macOS. ${icon.file_type.toUpperCase()} format, ${getFileSize(icon.file_size)}.`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head 
                title={formatTitle(icon.name)}
            >
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={`${icon.name}, ${icon.category}, macos icon, ${icon.file_type}, icon download${icon.tags ? ', ' + icon.tags : ''}`} />
                
                {/* Open Graph */}
                <meta property="og:title" content={`${icon.name} - macOS Icons`} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={icon.preview_path ? `${window.location.origin}/storage/${icon.preview_path}` : `${window.location.origin}/storage/${icon.file_path}`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${window.location.origin}/icons/${icon.slug}`} />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${icon.name} - macOS Icons`} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={icon.preview_path ? `${window.location.origin}/storage/${icon.preview_path}` : `${window.location.origin}/storage/${icon.file_path}`} />
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                        <h1 className="text-3xl font-bold text-[#1b1b18] mb-2">
                            {icon.name}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                {categoryName}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {icon.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(icon.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Icon Preview */}
                        <div className="lg:col-span-2">
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-8">
                                        <img
                                            src={icon.preview_path ? `/storage/${icon.preview_path}` : `/storage/${icon.file_path}`}
                                            alt={icon.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Info & Download */}
                        <div className="space-y-6">
                            {/* Download Card */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full bg-black text-white hover:bg-gray-800 mb-4"
                                        size="lg"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Icon
                                    </Button>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Downloads</span>
                                            <span className="font-semibold text-gray-900">{downloadCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Format</span>
                                            <span className="font-semibold text-gray-900 uppercase">{icon.file_type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Size</span>
                                            <span className="font-semibold text-gray-900">{getFileSize(icon.file_size)}</span>
                                        </div>
                                        {icon.size && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Icon Size</span>
                                                <span className="font-semibold text-gray-900">{icon.size}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Details Card */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-600 block mb-1">Category</span>
                                            <span className="font-medium text-gray-900 capitalize">{categoryName}</span>
                                        </div>
                                        {icon.tags && (
                                            <div>
                                                <span className="text-gray-600 block mb-1 flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    Tags
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {icon.tags.split(',').map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Description */}
                    {icon.description && (
                        <Card className="border-gray-200 shadow-sm mt-6">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {icon.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

