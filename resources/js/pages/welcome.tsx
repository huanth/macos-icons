import { AppFooter } from '@/components/app-footer';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatTitle } from '@/lib/utils';
import { dashboardRoutes, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Download, Share2, X } from 'lucide-react';

interface Icon {
    id: number;
    name: string;
    slug: string;
    category: string;
    file_path: string;
    preview_path: string | null;
    file_type: string;
    downloads: number;
    created_at: string;
    user: {
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface WelcomeProps {
    canRegister?: boolean;
    icons: {
        data: Icon[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    initialSearch?: string;
    initialCategory?: string;
}

export default function Welcome({ canRegister = true, icons: initialIcons, categories, initialSearch = '', initialCategory = 'all' }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [icons, setIcons] = useState(initialIcons.data);
    const [currentPage, setCurrentPage] = useState(initialIcons.current_page);
    const [hasMore, setHasMore] = useState(initialIcons.current_page < initialIcons.last_page);
    const [loading, setLoading] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Filter icons based on search and category
    const filteredIcons = icons.filter(icon => {
        const matchesSearch = searchQuery === '' || icon.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleIconClick = (icon: Icon) => {
        setSelectedIcon(icon);
        setIsDialogOpen(true);
        // Update URL with hash
        window.history.pushState(null, '', `#${icon.slug}`);
    };

    const handleDownload = (icon: Icon) => {
        // Create download link with slug
        const link = document.createElement('a');
        link.href = `/icons/${icon.slug}/download`;
        link.download = `${icon.slug}.${icon.file_type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update download count in UI optimistically
        setIcons(prevIcons => 
            prevIcons.map(i => 
                i.id === icon.id 
                    ? { ...i, downloads: i.downloads + 1 }
                    : i
            )
        );
        
        // Update selected icon if dialog is open
        if (selectedIcon && selectedIcon.id === icon.id) {
            setSelectedIcon({ ...selectedIcon, downloads: selectedIcon.downloads + 1 });
        }
    };

    const handleShare = async (icon: Icon) => {
        const url = `${window.location.origin}#${icon.slug}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: icon.name,
                    text: `Check out this macOS icon: ${icon.name}`,
                    url: url,
                });
            } catch (err) {
                // User cancelled or error occurred
                console.log('Share cancelled');
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            } catch (err) {
                // Fallback: Show URL
                prompt('Copy this link:', url);
            }
        }
    };

    const loadMoreIcons = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        const nextPage = currentPage + 1;
        
        try {
            const response = await fetch(`/?page=${nextPage}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            
            if (data.props.icons.data.length > 0) {
                setIcons(prev => [...prev, ...data.props.icons.data]);
                setCurrentPage(nextPage);
                setHasMore(nextPage < data.props.icons.last_page);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more icons:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle hash URL to open popup
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove #
            if (hash) {
                // Find icon by slug in all loaded icons
                const icon = icons.find(i => i.slug === hash);
                if (icon) {
                    setSelectedIcon(icon);
                    setIsDialogOpen(true);
                    // Scroll to icon card
                    const element = document.querySelector(`[data-icon-slug="${icon.slug}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            } else {
                // Close dialog if hash is removed
                setIsDialogOpen(false);
            }
        };

        // Check hash on mount
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [icons]);

    // Update hash when dialog closes (but not if it was closed by hash change)
    useEffect(() => {
        if (!isDialogOpen && window.location.hash && selectedIcon) {
            // Remove hash when dialog closes manually (not via hash change)
            const currentHash = window.location.hash.slice(1);
            if (currentHash === selectedIcon.slug) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
    }, [isDialogOpen, selectedIcon]);

    // Setup Intersection Observer for infinite scroll
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMoreIcons();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, currentPage]);

    return (
        <>
            <Head title={formatTitle()}>
                <meta name="description" content="Download beautiful, high-quality macOS-style icons for your projects. Free icon library with modern design and easy integration." />
                <meta name="keywords" content="macos icons, free icons, icon library, design resources, svg icons, icon download" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gray-50">
                {/* Fixed Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                    <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-8 max-w-7xl">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-black text-white">
                                <svg className="size-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-[#1b1b18]">
                                macOS Icons
                            </span>
                        </Link>
                        <nav className="flex items-center gap-6 text-sm">
                        {auth.user ? (
                                <>
                                    <Link
                                        href={dashboardRoutes.upload().url}
                                        className="hidden md:inline-block text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        Upload Icon
                                    </Link>
                            <Link
                                        href="/dashboard"
                                        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                                </>
                        ) : (
                            <>
                                <Link
                                        href={login().url}
                                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                            href={register().url}
                                            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 pt-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                        {/* Welcome Section */}
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#1b1b18] mb-4">
                                Welcome to macOS Icons
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover and download beautiful, high-quality macOS-style icons for your projects. 
                                Free icon library with modern design and easy integration.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${initialIcons.total} icons`}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Categories - Sticky */}
                        <div className="sticky top-16 z-40 bg-gray-50 py-4 mb-6 -mx-6 px-6">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === 'all'
                                            ? 'bg-black text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                >
                                    All Icons
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.slug)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                            selectedCategory === category.slug
                                                ? 'bg-black text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Icons Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredIcons.map((icon) => (
                                <div
                                    key={icon.id}
                                    data-icon-slug={icon.slug}
                                    onClick={() => handleIconClick(icon)}
                                    className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                >
                                    {/* Icon Preview */}
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                                        <img
                                            src={icon.preview_path ? `/storage/${icon.preview_path}` : `/storage/${icon.file_path}`}
                                            alt={icon.name}
                                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Icon Info */}
                                    <div className="p-3">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                                            {icon.name}
                                        </h3>
                                        {/* Category Badge */}
                                        <div className="mb-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                                {categories.find(cat => cat.slug === icon.category)?.name || icon.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 truncate">{icon.user.name}</span>
                                            <span className="text-gray-400">{new Date(icon.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                            <Download className="w-3 h-3 mr-1" />
                                            {icon.downloads}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Trigger */}
                        {hasMore && (
                            <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                                {loading && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                        <span>Loading more icons...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Results */}
                        {filteredIcons.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No icons found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AppFooter />

            {/* Icon Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedIcon && (
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#1b1b18]">
                                {selectedIcon.name}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-4 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                    {categories.find(cat => cat.slug === selectedIcon.category)?.name || selectedIcon.category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    by {selectedIcon.user.name}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(selectedIcon.created_at).toLocaleDateString()}
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-6">
                            {/* Icon Preview */}
                            <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-8 mb-6">
                                <img
                                    src={selectedIcon.preview_path ? `/storage/${selectedIcon.preview_path}` : `/storage/${selectedIcon.file_path}`}
                                    alt={selectedIcon.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    <span>{selectedIcon.downloads} downloads</span>
                                </div>
                                <div>
                                    <span className="uppercase">{selectedIcon.file_type}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => handleShare(selectedIcon)}
                                    variant="outline"
                                    className="flex-1 border-gray-300 hover:bg-gray-100"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button
                                    onClick={() => handleDownload(selectedIcon)}
                                    className="flex-1 bg-black text-white hover:bg-gray-800"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
