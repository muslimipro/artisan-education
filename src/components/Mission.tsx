'use client';

import { useTranslations } from 'next-intl';

type MissionValue = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const Mission = () => {
    const t = useTranslations('Mission');

    const missionValues: MissionValue[] = [
        {
            title: t('values.inclusiveEducation.title'),
            description: t('values.inclusiveEducation.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
            ),
        },
        {
            title: t('values.innovationFocus.title'),
            description: t('values.innovationFocus.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            ),
        },
        {
            title: t('values.globalImpact.title'),
            description: t('values.globalImpact.description'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
            ),
        },
    ];

    const missionStatements = [
        t('statements.first'),
        t('statements.second')
    ];

    return (
        <div className="mb-24">
            <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 transition-all duration-300 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="relative p-4">
                        <div className="relative">
                            <h3 className="text-4xl font-bold mb-2 text-primary">
                                {t('heading')}
                            </h3>
                            <div className="space-y-4">
                                {missionStatements.map((statement, index) => (
                                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {statement}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-4">
                        {missionValues.map((value, index) => (
                            <div key={index} className="group rounded-2xl transition-all duration-300 hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10">
                                <div className="flex items-center gap-6">
                                    <div className="flex-shrink-0 p-3 bg-white border border-slate-300 hover:border-primary rounded-xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary/10 group-hover:to-secondary/10">
                                        {value.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">
                                            {value.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mission; 