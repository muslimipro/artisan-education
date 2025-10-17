'use client'

import Link from 'next/link';
import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

// Type definitions
interface SocialLinkProps {
    href: string;
    name: string;
    icon: ReactNode;
    gradientClasses?: string;
}

interface FooterNavLinkProps {
    href: string;
    name: string;
}

// Define the type for social media data from JSON
interface SocialMediaData {
    name: string;
    url: string;
}

// New component for social media links with hover animation
const SocialLink = ({ href, name, icon }: SocialLinkProps) => (
    <Link
        href={href}
        className="text-white/70 hover:text-white transition-all duration-300 p-2.5 rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-emerald-500 hover:scale-110 group"
        aria-label={name}
        target="_blank"
        rel="noopener noreferrer"
    >
        <div className="transform group-hover:rotate-3">
            {icon}
        </div>
    </Link>
);

// New component for footer navigation links
const FooterNavLink = ({ href, name }: FooterNavLinkProps) => (
    <li>
        <Link
            href={href}
            className="text-gray-300 hover:text-white duration-300 inline-flex items-center group"
        >
            <span className="w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">{name}</span>
        </Link>
    </li>
);

// Type definitions for footer content
interface FooterLink {
    name: string;
    href: string;
}

interface FooterLinkSection {
    title: string;
    links: FooterLink[];
}

// Function to get social media icon based on name
const getSocialIcon = (name: string): ReactNode => {
    switch (name) {
        case 'Instagram':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            );
        case 'YouTube':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
            );
        case 'TikTok':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
            );
        default:
            return <></>;
    }
};

const Footer = () => {
    const t = useTranslations('Footer');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [socialMediaLinks, setSocialMediaLinks] = useState<SocialLinkProps[]>([]);

    // Update year automatically if user keeps the page open during new year
    useEffect(() => {
        const interval = setInterval(() => {
            const year = new Date().getFullYear();
            if (year !== currentYear) {
                setCurrentYear(year);
            }
        }, 1000 * 60 * 60); // Check every hour
        return () => clearInterval(interval);
    }, [currentYear]);

    // Fetch social media links from data.json
    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                if (data.socialMedia && Array.isArray(data.socialMedia)) {
                    const links = data.socialMedia.map((link: SocialMediaData) => ({
                        name: link.name,
                        href: link.url,
                        icon: getSocialIcon(link.name)
                    }));
                    setSocialMediaLinks(links);
                }
            })
            .catch(error => console.error('Error loading social media data:', error));
    }, []);

    const footerLinks: FooterLinkSection[] = [
        {
            title: t('navigation.title'),
            links: [
                { name: t('navigation.about'), href: '#aboutus' },
                { name: t('navigation.kits'), href: '#hardware' },
                { name: t('navigation.contacts'), href: '#contact' },
                { name: t('navigation.login'), href: 'https://rtsan.ai/signup' },
            ],
        },
        {
            title: t('legal.title'),
            links: [
                { name: t('legal.privacy'), href: '/privacy' },
                { name: t('legal.terms'), href: '/terms' },
                { name: t('legal.cookies'), href: '/cookies' },
            ],
        },
    ];

    return (
        <footer className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjkuNSIvPjwvZz48L3N2Zz4=')] opacity-10" />

            {/* Decorative top edge light bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"></div>

            {/* Updated newsletter section - new feature */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                {/* Main footer content - Updated to 3 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">
                    {/* Company info and logo section - now spans 1/3 */}
                    <div className="col-span-1">
                        <Link href="/" className="inline-block group mb-6">
                            <div className="flex items-center">
                                <div>
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Artisan</span>
                                    <span className="text-2xl font-medium text-white/60 ml-1">Education</span>
                                </div>
                            </div>
                        </Link>
                        <p className="text-white/70 mb-6">
                            {t('description')}
                        </p>
                        <div className="flex space-x-2">
                            {socialMediaLinks.map((link, index) => (
                                <SocialLink key={index} {...link} />
                            ))}
                        </div>
                    </div>

                    {/* Links sections - each now spans 1/3 */}
                    {footerLinks.map((column, index) => (
                        <div key={index}>
                            <h3 className="text-lg font-bold mb-6 relative inline-block">
                                {column.title}
                                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary"></span>
                            </h3>
                            <ul className="space-y-3">
                                {column.links.map((link, linkIndex) => (
                                    <FooterNavLink key={linkIndex} {...link} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section with copyright */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white/60 text-sm mb-4 md:mb-0">
                        &copy; {currentYear} Artisan Education. {t('copyright')}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 