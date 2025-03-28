import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroHeading from './HeroHeading';

interface HeroContentProps {
    isVisible: boolean;
    rotatingWords: string[];
}

const HeroContent = ({ isVisible, rotatingWords }: HeroContentProps) => {
    const t = useTranslations('Hero');

    return (
        <div className={`space-y-4 ${isVisible ? 'animate-slide-right' : 'opacity-0'}`}>

            <HeroHeading rotatingWords={rotatingWords} />

            <p className="text-lg md:text-xl text-gray-dark max-w-lg leading-relaxed">
                {t('platformDescription')}
            </p>

            <div className="flex">
                <Link
                    href="https://learn.artisan.education/signup" className="btn-primary text-md rounded-xl hover:text-primary border-2 border-primary text-center group flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                    <span>{t('startLearning')}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default HeroContent; 