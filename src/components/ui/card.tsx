import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-lg border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
Card.displayName = 'Card';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-6', className)}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = 'CardContent';

export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-6 pt-6 pb-4 flex flex-col space-y-1.5', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('font-semibold text-lg', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-6 pt-4 pb-6 flex items-center', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter'; 