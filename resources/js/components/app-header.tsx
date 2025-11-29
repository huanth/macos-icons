import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard, login, register } from '@/routes';
import dashboardRoutes from '@/routes/dashboard';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

// Navigation items for the header
const mainNavItems: NavItem[] = [
    {
        title: 'Blog',
        href: '/blog',
        icon: BookOpen,
    },
];

const rightNavItems: NavItem[] = [];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Logo */}
                    <Link
                        href="/"
                        prefetch
                        className="flex items-center"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-black text-white">
                            <svg className="size-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                        </div>
                    </Link>

                    {/* Mobile: Only Dashboard Link */}
                    <div className="lg:hidden">
                        {auth.user ? (
                            <Link
                                href={dashboard().url}
                                className="text-sm text-[#1b1b18] hover:text-gray-600 font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : null}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden items-center space-x-6 lg:flex">
                        {mainNavItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="text-[#1b1b18] hover:text-gray-600 font-medium transition-colors text-sm"
                            >
                                {item.title}
                            </Link>
                        ))}
                        {auth.user && (
                            <Link
                                href={dashboardRoutes.upload().url}
                                className="text-[#1b1b18] hover:text-gray-600 font-medium transition-colors text-sm"
                            >
                                Upload Icon
                            </Link>
                        )}
                    </div>

                    <div className="ml-auto hidden lg:flex items-center space-x-4">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1"
                                    >
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-gray-200 text-black">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm text-[#1b1b18] hover:text-gray-600 font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-md border border-gray-300 px-4 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-gray-400 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="fixed top-16 left-0 right-0 z-40 flex w-full border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-gray-600 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
