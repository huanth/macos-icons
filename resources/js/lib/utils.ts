import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Format page title with site name for SEO
 * @param pageTitle - The specific page title
 * @param includeTagline - Whether to include the tagline (default: true)
 * @returns Formatted title string
 */
export function formatTitle(pageTitle?: string, includeTagline: boolean = true): string {
    const siteName = 'macOS Icons';
    const tagline = 'Free High-Quality Icon Library';
    
    if (!pageTitle) {
        return includeTagline ? `${siteName} | ${tagline}` : siteName;
    }
    
    return includeTagline 
        ? `${pageTitle} - ${siteName} | ${tagline}`
        : `${pageTitle} - ${siteName}`;
}
