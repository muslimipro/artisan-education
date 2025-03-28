'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroVideo from './HeroVideo';

const Hero = () => {
    const t = useTranslations('Hero');
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const rotatingWords = [
        t('rotatingWords.innovators'),
        t('rotatingWords.engineers'),
        t('rotatingWords.programmers'),
        t('rotatingWords.scientists'),
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative pt-40 pb-32 md:pt-48 md:pb-40 overflow-hidden">
            <HeroBackground />

            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <HeroContent
                        isVisible={isVisible}
                        rotatingWords={rotatingWords}
                    />

                    <HeroVideo
                        isVisible={isVisible}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero; 