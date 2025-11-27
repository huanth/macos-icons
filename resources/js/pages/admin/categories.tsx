import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatTitle } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Trash2, Plus, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icons_count: number;
}

interface CategoriesProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Manage Categories',
        href: '/admin/categories',
    },
];

export default function Categories({ categories }: CategoriesProps) {
    const { toast } = useToast();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm({
        name: '',
        slug: '',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        slug: '',
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success!',
                    description: 'Category added successfully.',
                    variant: 'success',
                });
                resetAdd();
                setShowAddForm(false);
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to add category.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setEditData({
            name: category.name,
            slug: category.slug,
        });
    };

    const handleUpdate = (categoryId: number) => {
        put(`/admin/categories/${categoryId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success!',
                    description: 'Category updated successfully.',
                    variant: 'success',
                });
                setEditingId(null);
                resetEdit();
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to update category.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleDelete = (categoryId: number, categoryName: string) => {
        if (confirm(`Are you sure you want to delete category "${categoryName}"? This action cannot be undone.`)) {
            router.delete(`/admin/categories/${categoryId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Success!',
                        description: 'Category deleted successfully.',
                        variant: 'success',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to delete category.',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={formatTitle('Manage Categories - Admin')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gray-50">
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1b1b18] mb-2">
                            Manage Categories
                        </h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            <span>Organize your icons into categories</span>
                            {categories.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                {/* Add Category Form */}
                {showAddForm && (
                    <Card className="border-gray-200 shadow-sm bg-white">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="add-name">Category Name *</Label>
                                        <Input
                                            id="add-name"
                                            type="text"
                                            value={addData.name}
                                            onChange={(e) => {
                                                setAddData('name', e.target.value);
                                                setAddData('slug', generateSlug(e.target.value));
                                            }}
                                            className="border-gray-300"
                                            placeholder="e.g. System Icons"
                                            required
                                        />
                                        <InputError message={addErrors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="add-slug">Slug *</Label>
                                        <Input
                                            id="add-slug"
                                            type="text"
                                            value={addData.slug}
                                            onChange={(e) => setAddData('slug', e.target.value)}
                                            className="border-gray-300"
                                            placeholder="e.g. system-icons"
                                            required
                                        />
                                        <InputError message={addErrors.slug} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="submit"
                                        disabled={addProcessing}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        {addProcessing ? 'Adding...' : 'Add Category'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            resetAdd();
                                        }}
                                        className="border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Categories List */}
                {categories.length === 0 ? (
                    <Card className="border-gray-200 shadow-lg bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50" />
                                <FolderOpen className="w-20 h-20 text-gray-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                No categories yet
                            </h3>
                            <p className="text-gray-600 text-center max-w-md mb-8">
                                Create your first category to start organizing your icons.
                            </p>
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Category
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-gray-200 shadow-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                Category Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                Slug
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                Icons Count
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                                {editingId === category.id ? (
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.name}
                                                                onChange={(e) => {
                                                                    setEditData('name', e.target.value);
                                                                    setEditData('slug', generateSlug(e.target.value));
                                                                }}
                                                                className="border-gray-300"
                                                            />
                                                            <InputError message={editErrors.name} />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.slug}
                                                                onChange={(e) => setEditData('slug', e.target.value)}
                                                                className="border-gray-300"
                                                            />
                                                            <InputError message={editErrors.slug} />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-600">{category.icons_count}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdate(category.id)}
                                                                    disabled={editProcessing}
                                                                    className="bg-black text-white hover:bg-gray-800"
                                                                >
                                                                    {editProcessing ? 'Saving...' : 'Save'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setEditingId(null);
                                                                        resetEdit();
                                                                    }}
                                                                    className="border-gray-300"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-gray-900">{category.name}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                                {category.slug}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {category.icons_count} icons
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEdit(category)}
                                                                    className="border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white"
                                                                >
                                                                    <Edit className="w-4 h-4 mr-1" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleDelete(category.id, category.name)}
                                                                    className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

