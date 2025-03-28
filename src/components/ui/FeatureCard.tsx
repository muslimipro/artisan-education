import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Feature } from '@/types/hardwareTypes';

const FeatureCard: React.FC<Feature> = ({ title, description, image, className = '' }) => {
    const t = useTranslations('HardwareKits');
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`group ${className || ''}`}
        >
            <div className="h-full border border-slate-300 hover:border-primary overflow-hidden bg-white dark:bg-gray-800 rounded-2xl transition-all duration-300 hover:ring-2 hover:ring-secondary hover:ring-offset-4">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#10B981]/5">
                    <Image
                        src={image}
                        alt={t(title)}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 transition-colors">{t(title)}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t(description)}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureCard; 