'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import InstagramFeed from './InstagramFeed';
import SocialMediaGrid from './SocialMediaGrid';
import ContactForm from './ContactForm';

const Contact = () => {
    const t = useTranslations('Contact');
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

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

    return (
        <section id="contact" className="py-12 md:py-16 bg-gray-50 max-w-[90%] md:max-w-5xl lg:max-w-6xl mx-auto" ref={sectionRef}>
            <div className="container-custom">
                <h2 className="section-title">{t('sectionTitle')}</h2>
                <p className="section-subtitle">
                    {t('sectionSubtitle')}
                </p>

                <div className={`mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px] ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                    <div className="lg:col-span-8 h-full md:block hidden">
                        <InstagramFeed />
                    </div>
                    <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
                        <SocialMediaGrid />
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact; 