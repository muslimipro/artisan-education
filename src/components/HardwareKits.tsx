'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Custom hooks
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

// Components
import FeatureCard from '@/components/ui/FeatureCard';

// Data
import { featuresData } from '@/data/hardwareData';

interface HardwareKitData {
    modules: string;
    projects: string;
}

const HardwareKits = () => {
    const t = useTranslations('HardwareKits');
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [hardwareData, setHardwareData] = useState<HardwareKitData>({
        modules: "0",
        projects: "0"
    });

    useIntersectionObserver(sectionRef);

    // Fetch hardware kit data from data.json
    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                if (data.hardwareKits) {
                    setHardwareData(data.hardwareKits);
                }
            })
            .catch(error => console.error('Error loading hardware kit data:', error));
    }, []);

    const { scrollYProgress } = useScroll({
        target: contentRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

    return (
        <section
            id="hardware"
            ref={sectionRef}
            className="relative py-16 overflow-hidden bg-slate-50"
        >

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

                {/* Feature Showcase */}
                <div ref={contentRef} className="mb-24">
                    <motion.div
                        style={{ opacity, scale }}
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* Hero Image */}
                        <div className="order-2 lg:order-1">
                            <div className="relative">
                                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
                                    <Image
                                        src="/artisan/artisanBig.png"
                                        alt="Artisan Hardware Kit"
                                        fill
                                        className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="absolute -left-2 lg:-left-8 -bottom-2 lg:bottom-20 p-4 bg-white rounded-2xl shadow-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-4 py-1 rounded-lg backdrop-blur-sm">
                                            <div>
                                                <div className="text-2xl font-bold">{hardwareData.modules}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {t('stats.modules')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="absolute -right-2 lg:-right-8 -top-2 lg:top-20 p-4 bg-white rounded-2xl shadow-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-4 py-1 rounded-lg backdrop-blur-sm">
                                            <div>
                                                <div className="text-2xl font-bold">{hardwareData.projects}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {t('stats.projects')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-4"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                        {t('heading')}
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {t('description')}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="py-2"
                                >
                                    <button
                                        className="inline-flex items-center px-5 py-2.5 text-md font-semibold text-white bg-primary hover:bg-white hover:text-primary border-2 border-primary rounded-xl transition-colors duration-300"
                                        onClick={() => window.open('/pibody.pdf', '_blank')}
                                    >
                                        <span>{t('moreInfo')}</span>
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <FeatureCard
                                {...feature}
                                className="h-full"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HardwareKits; 