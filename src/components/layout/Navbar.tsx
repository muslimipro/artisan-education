'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// Define a type for supported locales
type Locale = (typeof routing.locales)[number];

const Navbar = () => {
    const t = useTranslations('Navbar');
    const router = useRouter();
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<Locale>(routing.defaultLocale as Locale);

    // Use the locales from the routing configuration for better maintainability
    const languages = routing.locales.map(code => ({
        code,
        name: t(`languages.${code}`)
    }));

    const navItems = [
        { href: '#aboutus', label: t('aboutUs') },
        { href: '#hardware', label: t('hardware') },
        { href: '#contact', label: t('contact') }
    ];

    // Forceful language detection from URL
    const detectLanguageFromURL = useCallback(() => {
        try {
            // Get the current URL from window.location to ensure we're reading the actual URL
            const url = typeof window !== 'undefined' ? window.location.pathname : pathname;

            // Extract locale segment - skip the leading slash and get the first segment
            const pathParts = url.split('/').filter(Boolean);
            const firstSegment = pathParts.length > 0 ? pathParts[0] : '';

            // Check if it's a valid locale
            const isValidLocale = routing.locales.includes(firstSegment as Locale);

            // Determine the language
            const detectedLang = isValidLocale ? firstSegment as Locale : routing.defaultLocale as Locale;

            // Update the language state
            setCurrentLang(detectedLang);

            console.log('🔍 Language detection:', {
                url,
                pathParts,
                firstSegment,
                isValidLocale,
                detectedLang
            });

            return detectedLang;
        } catch (error) {
            console.error('Error detecting language:', error);
            return routing.defaultLocale as Locale;
        }
    }, [pathname]);

    // Call detection on mount and pathname change
    useEffect(() => {
        detectLanguageFromURL();
    }, [detectLanguageFromURL, pathname]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Direct language switching with forced URL-based routing
    const handleLanguageChange = (langCode: Locale) => {
        if (langCode === currentLang) {
            setIsLanguageDropdownOpen(false);
            return;
        }

        try {
            // Get current URL without any locale prefix
            let pathWithoutLocale = pathname;

            // Check if the current URL has a locale prefix
            routing.locales.forEach(locale => {
                if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
                    // Remove the locale prefix
                    pathWithoutLocale = pathname.slice(locale.length + 1) || '/';
                }
            });

            console.log('🌐 Switching language:', {
                from: currentLang,
                to: langCode,
                currentPath: pathname,
                newPath: pathWithoutLocale,
            });

            // Navigate to the new locale path
            router.push(pathWithoutLocale, { locale: langCode });

            // Force update the UI immediately
            setCurrentLang(langCode);
            setIsLanguageDropdownOpen(false);
        } catch (error) {
            console.error('Error switching language:', error);
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offset = 80; // Height of the fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            setIsMobileMenuOpen(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.language-dropdown')) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Language display label (make sure it's uppercase)
    const currentLanguageDisplay = currentLang.toUpperCase();

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md ${isScrolled
                ? 'bg-white/95 dark:bg-background/95 backdrop-blur-md py-3'
                : 'bg-white/90 dark:bg-background/90 py-3'
                }`}
        >
            <div className="container-custom flex justify-between items-center">
                <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
                    <Image
                        src="/logo.svg"
                        alt="Artisan Logo"
                        width={36}
                        height={36}
                        className="mr-2"
                    />
                    <span className="text-[26px] font-bold text-black">Artisan</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="font-medium text-foreground hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
                        >
                            {item.label}
                        </a>
                    ))}

                    {/* Language Switcher - Improved UI */}
                    <div className="relative language-dropdown">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                            }}
                            className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-colors duration-300"
                            aria-label={t('selectLanguage')}
                        >
                            <span className="font-medium">{currentLanguageDisplay}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className={`w-4 h-4 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isLanguageDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 py-2 w-32 bg-white dark:bg-gray-light rounded-lg shadow-lg border border-slate-200 z-10">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 ${currentLang === lang.code ? 'text-primary font-medium' : 'text-foreground'}`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href="https://rtsan.ai/signup"
                        className="btn-primary border-2 border-primary flex items-center gap-2 group"
                    >
                        <span>{t('login')}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-foreground p-2 rounded-md hover:bg-gray-light transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden bg-white dark:bg-gray-light py-6 px-4 shadow-lg animate-slide-down border-t border-[#e5e7eb] dark:border-[#1f2937]"
                    aria-label="Mobile navigation menu"
                >
                    <div className="flex flex-col space-y-6">
                        {/* Language Switcher for Mobile */}
                        <div className="flex flex-col space-y-2">
                            <span className="font-medium text-foreground">{t('selectLanguage')}</span>
                            <div className="flex space-x-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`px-3 py-1 rounded-md transition-colors duration-300 ${currentLang === lang.code
                                            ? 'bg-slate-800 text-white font-medium'
                                            : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        aria-label={lang.name}
                                        aria-pressed={currentLang === lang.code}
                                    >
                                        {lang.code.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="font-medium text-foreground hover:text-primary transition-colors duration-300 flex items-center"
                            >
                                {item.label}
                            </a>
                        ))}

                        <Link
                            href="https://rtsan.ai/signup"
                            className="btn-primary inline-flex items-center justify-center gap-2 w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span>{t('login')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 