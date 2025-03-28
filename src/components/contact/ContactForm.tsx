import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FormState } from './types';
import emailjs from '@emailjs/browser';

interface ContactInfo {
    email: string;
    phone: string;
}

const ContactForm = () => {
    const t = useTranslations('Contact.form');
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, setFormState] = useState<FormState>({
        name: '',
        email: '',
        message: '',
    });
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    // Initialize EmailJS
    useEffect(() => {
        // Check environment variables
        console.log("EmailJS env variables:", {
            serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? 'Available' : 'Missing',
            templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Available' : 'Missing',
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Available' : 'Missing',
        });
        
        // Only initialize if public key is available
        if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
            emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
            console.log("EmailJS initialized");
        } else {
            console.error("EmailJS public key not found");
        }
    }, []);

    useEffect(() => {
        // Fetch contact info from the public data file
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                setContactInfo(data.contactInfo);
            })
            .catch(error => console.error('Error loading contact info:', error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Map EmailJS field names to our state field names
        const fieldNameMapping: Record<string, string> = {
            'from_name': 'name',
            'from_email': 'email',
            'message': 'message'
        };
        
        // Use the mapped field name if it exists, otherwise use the original name
        const stateField = fieldNameMapping[name] || name;
        
        setFormState(prev => ({ ...prev, [stateField]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setDebugInfo(null);

        console.log('Form submitted, sending email via EmailJS...');
        console.log('Form state:', formState);
        console.log('Form reference available:', !!formRef.current);
        
        if (formRef.current) {
            console.log('Form elements:', formRef.current.elements);
        }

        try {
            if (!formRef.current) {
                throw new Error('Form reference not available');
            }

            console.log('Using EmailJS parameters:', {
                serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.substring(0, 4) + '...'
            });

            // Send email using EmailJS
            const result = await emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            console.log('Email sent successfully:', result);
            setIsSubmitted(true);
            setFormState({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);

            // Create detailed error message
            const errorMessage = error instanceof Error ? error.message : 'An error occurred when sending your message';
            setError(errorMessage);

            // Add debug info for easier troubleshooting
            setDebugInfo(JSON.stringify({
                formData: {
                    hasName: !!formState.name,
                    hasEmail: !!formState.email,
                    hasMessage: !!formState.message,
                    emailLength: formState.email.length,
                    messageLength: formState.message.length
                },
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message
                } : 'Unknown error type',
                envCheck: {
                    hasServiceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                    hasTemplateId: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                    hasPublicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                }
            }, null, 2));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-300 p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-6">{t('title')}</h3>

            {/* Quick Contact Info */}
            <div className="mb-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                        {contactInfo.email}
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                    </div>
                    <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                        {contactInfo.phone}
                    </a>
                </div>
            </div>

            {isSubmitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center flex-1 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-bold text-green-800 mb-2">{t('success.title')}</h4>
                    <p className="text-green-700 mb-4">
                        {t('success.description')}
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-green-700 font-medium hover:underline"
                    >
                        {t('success.newMessage')}
                    </button>
                </div>
            ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700 mb-4">
                            <p className="font-medium">Error: {error}</p>
                            {debugInfo && (
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-sm">Debug Information</summary>
                                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{debugInfo}</pre>
                                </details>
                            )}
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('nameLabel')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="from_name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
                            placeholder={t('namePlaceholder')}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('emailLabel')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="from_email"
                            value={formState.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
                            placeholder={t('emailPlaceholder')}
                        />
                    </div>

                    <div className="flex-grow">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('messageLabel')}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formState.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full min-h-[120px] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
                            placeholder={t('messagePlaceholder')}
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('submitting')}
                                </>
                            ) : (
                                t('submitButton')
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactForm; 