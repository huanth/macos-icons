import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 1;
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <div className={hasBreadcrumbs ? 'pt-28' : 'pt-16'} style={{ minHeight: 'calc(100vh - 64px)' }}>
                <AppContent>{children}</AppContent>
            </div>
            <AppFooter />
        </AppShell>
    );
}
