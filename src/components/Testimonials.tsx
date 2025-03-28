'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Testimonials = () => {
    const t = useTranslations('Testimonials');
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    entry.target.classList.add('animate-fade-in');
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

    const testimonials = [
        {
            name: t('testimonials.student.name'),
            role: t('testimonials.student.role'),
            quote: t('testimonials.student.quote'),
            image: '/testimonials/student.jpg',
            delay: 'delay-0'
        },
        {
            name: t('testimonials.teacher.name'),
            role: t('testimonials.teacher.role'),
            quote: t('testimonials.teacher.quote'),
            image: '/testimonials/teacher.png',
            delay: 'delay-150'
        },
        {
            name: t('testimonials.principal.name'),
            role: t('testimonials.principal.role'),
            quote: t('testimonials.principal.quote'),
            image: '/testimonials/principal.jpg',
            delay: 'delay-300'
        }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    return (
        <section className="py-20 bg-slate-50" ref={sectionRef}>
            <div className="container-custom px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        {t('sectionTitle')}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('sectionSubtitle')}
                    </p>
                </div>

                {/* Mobile View */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden">
                        <div
                            className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} 
                                      bg-white rounded-2xl p-6 border border-slate-200 flex flex-col`}
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden mr-4 relative">
                                    <Image
                                        src={testimonials[currentIndex].image}
                                        alt={testimonials[currentIndex].name}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 768px) 64px, 64px"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{testimonials[currentIndex].name}</h3>
                                    <p className="text-slate-600">{testimonials[currentIndex].role}</p>
                                </div>
                            </div>
                            <div className="flex-grow relative">
                                <p className="text-slate-600 leading-relaxed pl-2">{testimonials[currentIndex].quote}</p>
                                <svg className="absolute -top-4 -left-4 w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6 gap-4">
                        <button
                            onClick={prevTestimonial}
                            className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                            aria-label="Next testimonial"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`${isVisible ? 'animate-fade-in ' + testimonial.delay : 'opacity-0'} 
                                      bg-white rounded-2xl p-6 border border-slate-200 flex flex-col`}
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden mr-4 relative">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 768px) 64px, 64px"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{testimonial.name}</h3>
                                    <p className="text-slate-600">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="flex-grow relative">
                                <p className="text-slate-600 leading-relaxed pl-2">{testimonial.quote}</p>
                                <svg className="absolute -top-4 -left-4 w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 