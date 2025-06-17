'use client';

import { useTranslations } from 'next-intl';
import { Marquee } from '@/components/ui/Marquee';
import Image from 'next/image';

const partners = [
    // { name: 'Partner 1', logo: '/partners/artisanPartner1.png' },
    { name: 'Partner 2', logo: '/partners/artisanPartner2.png' },
    // { name: 'Partner 3', logo: '/partners/artisanPartner3.png' },
    { name: 'Partner 4', logo: '/partners/artisanPartner4.png' },
    { name: 'Partner 5', logo: '/partners/artisanPartner5.png' },
];

export default function CompaniesRibbon() {
    const t = useTranslations('CompaniesRibbon');

    return (
        <section className="mx-auto max-w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-6">
                    {t('title')}
                </h2>
            </div>
            <div className="w-screen relative border-y border-slate-300">
                <Marquee
                    className="py-8"
                    speed={50}
                >
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="mx-8 flex w-[200px] items-center justify-center"
                        >
                            <div className="relative h-[55px] w-full">
                                <Image
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    fill
                                    className="object-contain"
                                    sizes="200px"
                                    priority
                                />
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
} 