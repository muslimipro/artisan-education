'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    reverse?: boolean;
    speed?: number;
}

export const Marquee = ({
    children,
    className,
    reverse = false,
    speed = 40,
}: MarqueeProps) => {
    return (
        <div
            className={cn(
                'flex w-full overflow-hidden [--duration:40s]',
                className
            )}
            style={{
                '--duration': `${speed}s`,
            } as React.CSSProperties}
        >
            <div
                className={cn(
                    'flex min-w-full shrink-0 items-center justify-around',
                    'animate-marquee',
                    reverse && 'animate-marquee-reverse'
                )}
            >
                {children}
            </div>
            <div
                className={cn(
                    'flex min-w-full shrink-0 items-center justify-around',
                    'animate-marquee',
                    reverse && 'animate-marquee-reverse'
                )}
                aria-hidden
            >
                {children}
            </div>
        </div>
    );
}; 