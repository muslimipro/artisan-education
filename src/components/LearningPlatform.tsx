'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const LearningPlatform = () => {
    const t = useTranslations('LearningPlatform');
    const [activeTab, setActiveTab] = useState('self-paced');
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useIntersectionObserver(sectionRef, {
        threshold: 0.1,
        rootMargin: '0px',
        className: 'animate-fade-in'
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: contentRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

    useEffect(() => {
        const handleScrollIndicators = () => {
            if (window.innerWidth < 768) {
                setShowLeftScroll(false);
                setShowRightScroll(false);
                return;
            }

            const container = tabsContainerRef.current;
            if (!container) return;

            setShowLeftScroll(container.scrollLeft > 20);
            const isAtEnd = container.scrollWidth - container.scrollLeft <= container.clientWidth + 20;
            setShowRightScroll(!isAtEnd);
        };

        const container = tabsContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScrollIndicators);
            handleScrollIndicators();
            window.addEventListener('resize', handleScrollIndicators);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScrollIndicators);
            }
            window.removeEventListener('resize', handleScrollIndicators);
        };
    }, []);

    const handleScrollTabs = (direction: 'left' | 'right') => {
        if (window.innerWidth < 768) return;

        const container = tabsContainerRef.current;
        if (!container) return;

        const scrollAmount = 200;
        const targetScroll = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    };

    const features = [
        {
            id: 'self-paced',
            title: t('features.selfPaced.title'),
            description: t('features.selfPaced.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            image: '/platform/platform-self-paced.png',
            highlights: [
                t('features.selfPaced.highlights.0'),
                t('features.selfPaced.highlights.1'),
                t('features.selfPaced.highlights.2')
            ]
        },
        {
            id: 'ide',
            title: t('features.ide.title'),
            description: t('features.ide.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
            ),
            image: '/platform/platform-ide.png',
            highlights: [
                t('features.ide.highlights.0'),
                t('features.ide.highlights.1'),
                t('features.ide.highlights.2')
            ]
        },
        {
            id: 'dashboard',
            title: t('features.dashboard.title'),
            description: t('features.dashboard.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
            ),
            image: '/platform/platform-dashboard.jpg',
            highlights: [
                t('features.dashboard.highlights.0'),
                t('features.dashboard.highlights.1'),
                t('features.dashboard.highlights.2')
            ]
        },
        {
            id: 'curriculum',
            title: t('features.curriculum.title'),
            description: t('features.curriculum.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            image: '/platform/platform-curriculum.png',
            highlights: [
                t('features.curriculum.highlights.0'),
                t('features.curriculum.highlights.1'),
                t('features.curriculum.highlights.2')
            ]
        },
    ];

    const activeFeature = features.find(feature => feature.id === activeTab);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTabChange(tabId);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section id="aboutus" className="py-16 lg:py-28 relative overflow-hidden" ref={sectionRef}>
            <div className="container-custom px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-12 lg:mb-16"
                >
                    <h2 className="section-title">{t('sectionTitle')}</h2>
                    <p className="section-subtitle">
                        {t('sectionSubtitle')}
                    </p>
                </motion.div>

                {/* Responsive tabs with scroll indicators */}
                <div className="relative mb-8 lg:mb-12 w-full">
                    {/* Left scroll button - only for non-mobile screens */}
                    <button
                        className={`absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-slate-200 text-primary transition-all duration-300 hover:bg-primary hover:text-white hidden md:block
                            ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => handleScrollTabs('left')}
                        aria-label="Scroll tabs left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Left fade gradient indicator - only for non-mobile screens */}
                    <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-[1] pointer-events-none hidden md:block
                        ${showLeftScroll ? 'opacity-100' : 'opacity-0'}`}>
                    </div>

                    {/* Tabs container with grid for mobile, flex for larger screens */}
                    <motion.div
                        ref={tabsContainerRef}
                        className="md:flex md:justify-center w-full md:overflow-x-auto md:scrollbar-hide md:pb-0 md:scroll-smooth"
                        aria-label="Feature tabs"
                        initial={!isLargeScreen ? "hidden" : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileInView={!isLargeScreen ? "visible" : undefined}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true }}
                        variants={!isLargeScreen ? containerVariants : undefined}
                    >
                        <div className="bg-white rounded-xl p-1.5 md:inline-flex md:gap-4 md:flex-nowrap w-full grid grid-cols-2 gap-4 md:grid-cols-none">
                            {features.map((feature, index) => (
                                <motion.button
                                    key={feature.id}
                                    className={`md:flex-1 p-3 rounded-xl border-2 font-medium transition-all duration-300 flex flex-col items-center gap-2
                                        ${activeTab === feature.id
                                            ? 'bg-primary/10 shadow-md border-primary ring-2 ring-secondary ring-offset-2'
                                            : 'text-gray-dark border-slate-200 hover:text-primary hover:bg-primary/5'
                                        }`}
                                    onClick={() => handleTabChange(feature.id)}
                                    onKeyDown={(e) => handleKeyDown(e, feature.id)}
                                    aria-selected={activeTab === feature.id}
                                    role="tab"
                                    tabIndex={0}
                                    aria-label={`Tab for ${feature.title}`}
                                    variants={!isLargeScreen ? itemVariants : undefined}
                                    custom={index}
                                    initial={!isLargeScreen ? "hidden" : false}
                                    animate={!isLargeScreen ? "visible" : false}
                                >
                                    <div className="text-primary">
                                        {feature.icon}
                                    </div>
                                    <span className="text-center line-clamp-2 text-sm">{feature.title}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right fade gradient indicator - only for non-mobile screens */}
                    <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-[1] pointer-events-none hidden md:block
                        ${showRightScroll ? 'opacity-100' : 'opacity-0'}`}>
                    </div>

                    {/* Right scroll button - only for non-mobile screens */}
                    <button
                        className={`absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-slate-200 text-primary transition-all duration-300 hover:bg-primary hover:text-white hidden md:block
                            ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => handleScrollTabs('right')}
                        aria-label="Scroll tabs right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Content area - stack on mobile, side-by-side on larger screens */}
                <motion.div
                    ref={contentRef}
                    style={{ opacity, scale }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start"
                >
                    {/* Feature image - full width on mobile, 8 columns on large screens */}
                    <div className="relative w-full aspect-[4/3] lg:aspect-[16/8] order-2 lg:order-1 lg:col-span-8">
                        {features.map((feature) => (
                            feature.id === activeTab && (
                                <motion.div
                                    key={feature.id}
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg border border-[#1f2937] transform transition-transform hover:scale-[1.01] duration-500">
                                        <div className="h-full relative">
                                            <Image
                                                src={feature.image}
                                                alt={feature.title}
                                                fill
                                                className="object-contain"
                                                priority={feature.id === 'self-paced'}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                                            />
                                        </div>

                                        {/* Browser UI elements */}
                                        <div className="absolute top-0 left-0 right-0 h-8 bg-white border-b border-[#e5e7eb] flex items-center px-2 sm:px-4 z-10">
                                            <div className="flex space-x-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="mx-auto text-xs text-gray-500">
                                                learn.artisan.education
                                            </div>
                                        </div>
                                    </div>


                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl transform rotate-12 -z-10"></div>
                                    <div className="absolute -top-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-xl transform -rotate-12 -z-10"></div>
                                </motion.div>
                            )
                        ))}
                    </div>

                    {/* Feature details - above on mobile, 4 columns on large screens */}
                    <div className="space-y-4 sm:space-y-6 order-1 lg:order-2 lg:col-span-4">
                        <div className="relative h-full">
                            {features.map((feature) => (
                                feature.id === activeTab && (
                                    <motion.div
                                        key={feature.id}
                                        className="space-y-6"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start gap-3">
                                            <div className='p-2'>
                                                <motion.h3
                                                    className="text-2xl font-bold mb-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1, duration: 0.5 }}
                                                >{feature.title}</motion.h3>
                                                <motion.p
                                                    className="text-md text-gray-dark"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2, duration: 0.5 }}
                                                >{feature.description}</motion.p>
                                            </div>
                                        </div>

                                        <motion.div
                                            className="grid gap-2 mt-4"
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {activeFeature?.highlights.map((highlight, index) => (
                                                <motion.div
                                                    key={highlight}
                                                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 flex items-center gap-3 transition-all duration-300 hover:shadow-md hover:border-primary/50"
                                                    tabIndex={0}
                                                    role="listitem"
                                                    variants={itemVariants}
                                                    custom={index}
                                                >
                                                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary transition-colors duration-300 group-hover:bg-primary/20">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-md font-medium">{highlight}</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LearningPlatform; 