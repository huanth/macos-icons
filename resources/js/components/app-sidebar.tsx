import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import dashboardRoutes from '@/routes/dashboard';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Upload, Image, Users, Shield, FolderOpen } from 'lucide-react';
import AppLogo from './app-logo';

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Upload Icon',
        href: dashboardRoutes.upload(),
        icon: Upload,
    },
    {
        title: 'My Icons',
        href: dashboardRoutes.myIcons(),
        icon: Image,
    },
];

const getAdminNavItems = (): NavItem[] => [
    {
        title: 'Admin Dashboard',
        href: '/admin' as any,
        icon: Shield,
    },
    {
        title: 'All Icons',
        href: '/admin/icons' as any,
        icon: Image,
    },
    {
        title: 'Categories',
        href: '/admin/categories' as any,
        icon: FolderOpen,
    },
    {
        title: 'Users',
        href: '/admin/users' as any,
        icon: Users,
    },
    {
        title: 'Upload Icon',
        href: dashboardRoutes.upload(),
        icon: Upload,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    const navItems = isAdmin ? getAdminNavItems() : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
