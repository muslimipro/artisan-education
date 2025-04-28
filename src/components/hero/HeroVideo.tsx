import { useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import VideoModal from './VideoModal';

interface HeroVideoProps {
    isVisible: boolean;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

const HeroVideo = ({ isVisible, isModalOpen, setIsModalOpen }: HeroVideoProps) => {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const videoRef = useRef<HTMLVideoElement>(null);

    const videoUrls: Record<string, string> = {
        kk: "https://www.youtube.com/embed/tLuB0fVZh_Q?si=npgBeJU3BRLdQo3-",
        ru: "https://www.youtube.com/embed/vbmjZ7cQKzs?si=0x9JzMdKtBnoi9-4",
        en: "https://www.youtube.com/embed/X4NMUYlDafI?si=Mv_U5ZvFhGmYAfJW",
    };

    const selectedVideoUrl = videoUrls[locale] || videoUrls['en'];

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className={`relative ${isVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            <div className="relative w-full aspect-video max-w-4xl mx-auto group">
                <div
                    className="absolute inset-0 bg-white shadow-2xl rounded-2xl transform overflow-hidden transition-all duration-500 ease-in-out group-hover:scale-105 cursor-pointer z-20"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="relative w-full h-full">
                        <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded-xl text-sm font-medium shadow-md group-hover:hidden">
                            {t('watchVideo')}
                        </div>
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            loop
                            muted
                            playsInline
                        >
                            <source src="/artisanDemo.mp4" type="video/mp4" />
                            {t('browserNotSupported')}
                        </video>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all duration-300">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/90 group-hover:bg-white transition-colors shadow-xl hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-primary translate-x-0.5">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoUrl={selectedVideoUrl}
            />
        </div>
    );
};

export default HeroVideo; 