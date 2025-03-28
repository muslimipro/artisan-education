'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface StatsData {
    activeStudents: string;
    kits: string;
}

const Stats = () => {
    const t = useTranslations('Stats');
    const [isVisible, setIsVisible] = useState(false);
    const [statsData, setStatsData] = useState<StatsData>({
        activeStudents: "0",
        kits: "0"
    });
    const [userCount, setUserCount] = useState(0);
    const [kitCount, setKitCount] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Fetch stats data from data.json
    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                if (data.stats) {
                    setStatsData(data.stats);
                }
            })
            .catch(error => console.error('Error loading stats data:', error));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            // Parse the numeric value from the strings, removing commas
            const targetUserCount = parseInt(statsData.activeStudents.replace(/,/g, ''));
            const targetKitCount = parseInt(statsData.kits.replace(/,/g, ''));

            const userInterval = setInterval(() => {
                setUserCount(prev => {
                    const increment = Math.max(Math.floor(targetUserCount / 50), 1000);
                    const next = prev + increment;
                    if (next >= targetUserCount) {
                        clearInterval(userInterval);
                        return targetUserCount;
                    }
                    return next;
                });
            }, 30);

            const kitInterval = setInterval(() => {
                setKitCount(prev => {
                    const increment = Math.max(Math.floor(targetKitCount / 50), 20);
                    const next = prev + increment;
                    if (next >= targetKitCount) {
                        clearInterval(kitInterval);
                        return targetKitCount;
                    }
                    return next;
                });
            }, 30);

            return () => {
                clearInterval(userInterval);
                clearInterval(kitInterval);
            };
        }
    }, [isVisible, statsData]);

    const stats = [
        {
            value: userCount.toLocaleString(),
            label: t('stats.activeStudents.label'),
            description: t('stats.activeStudents.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-700 group-hover:rotate-12">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
        },
        {
            value: kitCount.toLocaleString(),
            label: t('stats.kits.label'),
            description: t('stats.kits.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-700 group-hover:rotate-12">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
            ),
        },
    ];

    // Animation classes based on visibility
    const getHeaderClasses = () => isVisible ? 'animate-slide-down opacity-100' : 'opacity-0 translate-y-[-20px]';
    const getSubHeaderClasses = () => isVisible ? 'animate-fade-in opacity-100 delay-200' : 'opacity-0';

    // Stagger animation delay classes for stats cards
    const getStaggeredDelay = (index: number) => {
        const delayMs = 300 + (index * 150);
        return `delay-[${delayMs}ms]`;
    };

    return (
        <section className="py-12 lg:py-20 bg-white overflow-hidden" ref={sectionRef}>
            <div className="container-custom px-4 sm:px-6">
                <div className="text-center mb-8 sm:mb-12 md:mb-16" ref={headerRef}>
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 transition-all duration-700 ${getHeaderClasses()}`}>
                        {t('heading')}
                    </h2>
                    <p className={`text-base sm:text-lg max-w-2xl mx-auto text-slate-600 transition-all duration-700 ${getSubHeaderClasses()}`}>
                        {t('subheading')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-4 lg:gap-6 max-w-5xl mx-auto perspective-1000">
                    {/* Stats Column */}
                    <div className="flex flex-col gap-4 sm:gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`group transform ${isVisible ? `animate-slide-left opacity-100 ${getStaggeredDelay(index)}` : 'opacity-0 translate-x-[20px]'} transition-all duration-700 ease-out`}
                            >
                                <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-row items-start gap-3 sm:gap-4 md:gap-6 transition-all duration-500 ease-out hover:border-primary">
                                    <div className="p-2 sm:p-3 md:p-4 text-primary rounded-lg">
                                        {stat.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-slate-800">{stat.value}</div>
                                        <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-slate-700">{stat.label}</div>
                                        <p className="text-sm sm:text-base text-slate-600">{stat.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Partner Column */}
                    <div className={`relative h-full mt-4 sm:mt-0 transition-all duration-1000 ${isVisible ? 'animate-slide-right opacity-100 delay-700' : 'opacity-0 translate-x-[-20px]'}`}>
                        <div className="sticky top-8 h-full">
                            <div className="bg-white border border-slate-300 rounded-2xl h-full p-6 sm:p-8 md:p-10 lg:p-12 text-center transition-all duration-500 ease-out hover:border-primary flex flex-col justify-center preserve-3d">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 text-slate-800">{t('partnerSchool.heading')}</h3>
                                <p className="mx-auto mb-6 sm:mb-8 text-base sm:text-lg text-slate-600">
                                    {t('partnerSchool.description')}
                                </p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={scrollToContact}
                                        className="bg-primary inline-flex text-white font-semibold py-3 px-6 rounded-xl text-base sm:text-lg transition-all duration-300 touch-manipulation 
                                        hover:bg-white hover:text-primary border-2 border-primary">
                                        {t('partnerSchool.buttonText')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats; 