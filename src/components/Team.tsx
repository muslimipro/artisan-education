'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const Team = () => {
    const t = useTranslations('Team');
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const teamPhotos = [
        // {
        //     url: '/team/gallery1.jpg',
        //     caption: t('gallery.photo1'),
        //     isMain: true
        // },
        {
            url: '/team/gallery2.jpg',
            caption: t('gallery.photo2'),
            isMain: false
        },
        // {
        //     url: '/team/gallery3.jpg',
        //     caption: t('gallery.photo3'),
        //     isMain: false
        // },
        {
            url: '/team/gallery4.jpg',
            caption: t('gallery.photo4'),
            isMain: false
        }
    ];

    const navigateImage = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setActiveIndex((prev) => (prev === 0 ? teamPhotos.length - 1 : prev - 1));
        } else {
            setActiveIndex((prev) => (prev === teamPhotos.length - 1 ? 0 : prev + 1));
        }
    };

    return (
        <section id="team" className="mt-10 py-10 md:py-14" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="section-title text-center mb-12">{t('sectionTitle')}</h2>

                {/* Two-column layout container */}
                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    {/* Left column - Image Gallery (70% width on desktop) */}
                    <div className="w-full lg:w-[70%]">
                        <div className="relative">
                            <div className="relative aspect-[16/9] w-full">
                                <motion.div
                                    key={activeIndex}
                                    className="relative w-full h-full rounded-xl overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={teamPhotos[activeIndex].url}
                                        alt={teamPhotos[activeIndex].caption}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 70vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <p className="text-white text-xl font-medium">{teamPhotos[activeIndex].caption}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Navigation Arrows - Hidden on mobile, visible on top of gallery on larger screens */}
                            <div className="hidden md:block">
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
                                    aria-label="Next image"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Dots */}
                            <div className="flex justify-center gap-2 mt-4">
                                {teamPhotos.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? 'bg-primary w-8'
                                            : 'bg-slate-300 hover:bg-slate-500'
                                            }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mobile Navigation Controls - Only visible on small screens */}
                        <div className="flex md:hidden justify-center items-center gap-4 mt-4">
                            <button
                                onClick={() => navigateImage('prev')}
                                className="bg-white/80 p-2 rounded-full border border-slate-300 hover:bg-white transition-all duration-200"
                                aria-label="Previous image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => navigateImage('next')}
                                className="bg-white/80 p-2 rounded-full border border-slate-300 hover:bg-white transition-all duration-200"
                                aria-label="Next image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right column - Text Content (30% width on desktop) */}
                    <div className="w-full lg:w-[30%] flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4">{t('description.heading')}</h3>
                        <p className="text-slate-700 mb-6">
                            {t('description.paragraph1')}
                        </p>
                        <p className="text-slate-700 mb-6">
                            {t('description.paragraph2')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team; 