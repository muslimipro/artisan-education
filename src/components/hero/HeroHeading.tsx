import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

interface HeroHeadingProps {
    rotatingWords: string[];
}

const HeroHeading = ({ rotatingWords }: HeroHeadingProps) => {
    const t = useTranslations('Hero');
    const pathname = usePathname();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    // Determine the current language from the URL
    const isKazakh = pathname.startsWith('/kk');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    const wordAnimation = {
        initial: {
            y: 50,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1]
            }
        },
        exit: {
            y: -50,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1]
            }
        }
    };

    // For Kazakh, show the rotating word in the middle
    if (isKazakh) {
        return (
            <h1 className="max-w-[35rem] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('inspiringNewGeneration.part1')}
                <div className="text-primary relative h-[1.0em] inline-block mx-2">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={rotatingWords[currentWordIndex]}
                            variants={wordAnimation}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="relative z-10"
                        >
                            {rotatingWords[currentWordIndex]}
                        </motion.span>
                    </AnimatePresence>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform"></span>
                </div>
                {t('inspiringNewGeneration.part2')}
            </h1>
        );
    }

    // For other languages, show the rotating word at the end (original behavior)
    return (
        <h1 className="max-w-[35rem] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('inspiringNewGeneration.part1')}
            <div className="text-primary relative h-[1.0em]">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={rotatingWords[currentWordIndex]}
                        variants={wordAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative z-10"
                    >
                        {rotatingWords[currentWordIndex]}
                    </motion.span>
                </AnimatePresence>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform"></span>
            </div>
            {t('inspiringNewGeneration.part2')}
        </h1>
    );
};

export default HeroHeading; 