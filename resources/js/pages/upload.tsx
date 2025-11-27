import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { dashboard, dashboardRoutes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, FileIcon, Upload as UploadIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface UploadProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Upload Icon',
        href: dashboardRoutes.upload().url,
    },
];

export default function Upload({ categories }: UploadProps) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        icon: null as File | null,
        preview_image: null as File | null,
        name: '',
        description: '',
        category: '',
        tags: '',
        size: '',
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [previewImagePreview, setPreviewImagePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('icon', file);
            setFileType(file.type);
            
            // Create preview only for SVG
            if (file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                // For ICNS, show file info
                setPreview('icns');
            }
        }
    };

    const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('preview_image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setData('icon', null);
        setPreview(null);
        setFileType('');
    };

    const removePreviewImage = () => {
        setData('preview_image', null);
        setPreviewImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate ICNS requires preview image
        if (fileType !== 'image/svg+xml' && !data.preview_image) {
            toast({
                title: 'Preview Required',
                description: 'Please upload a preview image (PNG/JPG) for ICNS files.',
                variant: 'destructive',
            });
            return;
        }
        
        post(dashboardRoutes.upload().url, {
            onSuccess: () => {
                toast({
                    title: 'Success!',
                    description: 'Your macOS icon has been uploaded successfully.',
                    variant: 'success',
                });
                reset();
                setPreview(null);
                setPreviewImagePreview(null);
                setFileType('');
            },
            onError: () => {
                toast({
                    title: 'Upload Failed',
                    description: 'There was an error uploading your icon. Please try again.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Upload Icon')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold text-[#1b1b18] mb-2">
                        Upload macOS Icon
                    </h1>
                    <p className="text-gray-600">
                        Share your macOS-style icon designs with the community. Supported formats: SVG, ICNS (max 5MB)
                    </p>
                </div>

                <Card className="max-w-3xl border-gray-200">
                    <CardHeader>
                        <CardTitle>macOS Icon Details</CardTitle>
                        <CardDescription>
                            Upload your macOS-style icon with complete information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="icon">macOS Icon File *</Label>
                                {!preview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            id="icon"
                                            accept="image/svg+xml,.icns"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="icon"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
                                            <span className="text-sm font-medium text-gray-700 mb-1">
                                                Click to upload macOS icon
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                SVG or ICNS format (max 5MB)
                                            </span>
                                            <span className="text-xs text-gray-400 mt-2">
                                                Recommended: 1024x1024px SVG
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative border-2 border-gray-300 rounded-lg p-8">
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center justify-center">
                                            {preview === 'icns' ? (
                                                <div className="flex flex-col items-center">
                                                    <FileIcon className="w-24 h-24 text-gray-400" />
                                                    <p className="text-sm text-gray-500 mt-2">ICNS File</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={preview || ''}
                                                    alt="Preview"
                                                    className="max-w-full max-h-48 object-contain"
                                                />
                                            )}
                                        </div>
                                        <p className="text-center text-sm text-gray-600 mt-4">
                                            {data.icon?.name}
                                        </p>
                                    </div>
                                )}
                                <InputError message={errors.icon} />
                            </div>

                            {/* Preview Image for ICNS */}
                            {fileType !== 'image/svg+xml' && data.icon && (
                                <div className="space-y-2">
                                    <Label htmlFor="preview_image">Preview Image (PNG/JPG) *</Label>
                                    <p className="text-xs text-gray-500 mb-2">
                                        ICNS files cannot be previewed in browsers. Please upload a PNG or JPG preview image.
                                    </p>
                                    {!previewImagePreview ? (
                                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-blue-50">
                                            <input
                                                type="file"
                                                id="preview_image"
                                                accept="image/png,image/jpeg,image/jpg"
                                                onChange={handlePreviewImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="preview_image"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <UploadIcon className="w-10 h-10 text-blue-500 mb-3" />
                                                <span className="text-sm font-medium text-gray-700 mb-1">
                                                    Click to upload preview image
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    PNG or JPG (recommended: 512x512px)
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                                            <button
                                                type="button"
                                                onClick={removePreviewImage}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="flex items-center justify-center">
                                                <img
                                                    src={previewImagePreview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-48 object-contain"
                                                />
                                            </div>
                                            <p className="text-center text-sm text-gray-600 mt-3">
                                                {data.preview_image?.name}
                                            </p>
                                        </div>
                                    )}
                                    <InputError message={errors.preview_image} />
                                </div>
                            )}

                            {/* Icon Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Icon Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Finder, Safari, Mail"
                                    className="border-gray-300"
                                />
                                <p className="text-xs text-gray-500">
                                    Use the official app name if applicable
                                </p>
                                <InputError message={errors.name} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the icon and its use case"
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500">
                                    Add details about the icon design, inspiration, or usage
                                </p>
                                <InputError message={errors.description} />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} />
                            </div>

                            {/* Size/Resolution */}
                            <div className="space-y-2">
                                <Label htmlFor="size">Icon Size</Label>
                                <select
                                    id="size"
                                    value={data.size}
                                    onChange={(e) => setData('size', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select size (optional)</option>
                                    <option value="512">512x512</option>
                                    <option value="1024">1024x1024 (Recommended)</option>
                                    <option value="2048">2048x2048</option>
                                    <option value="vector">Vector/Scalable</option>
                                </select>
                                <p className="text-xs text-gray-500">
                                    For SVG files, select "Vector/Scalable"
                                </p>
                                <InputError message={errors.size} />
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (optional)</Label>
                                <Input
                                    id="tags"
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="e.g., macos, big sur, monterey, app icon"
                                    className="border-gray-300"
                                />
                                <p className="text-xs text-gray-500">
                                    Add relevant tags like macOS version, app type, style (comma separated)
                                </p>
                                <InputError message={errors.tags} />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.icon}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    {processing ? 'Uploading...' : 'Upload Icon'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setPreview(null);
                                    }}
                                    className="border-gray-300"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

