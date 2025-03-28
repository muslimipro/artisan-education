import nodemailer, { TransportOptions } from 'nodemailer';

// Determine port and security settings
const port = Number(process.env.EMAIL_PORT) || 587;
const isSecure = process.env.EMAIL_SECURE === 'true' || port === 2525;

// Log email configuration for debugging (excluding sensitive data)
console.log('Email Configuration:', {
    host: process.env.EMAIL_HOST,
    port,
    secure: isSecure,
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
});

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: isSecure, // true for 465, false for other ports like 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Add TLS options for more explicit control
    tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false,
        // Force specific TLS version
        minVersion: 'TLSv1.2'
    }
} as TransportOptions);

// Verify connection configuration
transporter.verify()
    .then(() => console.log('SMTP server connection verified successfully'))
    .catch(err => console.error('SMTP connection verification failed:', err));

// Define email sender interface
interface EmailSender {
    name: string;
    address: string;
}

// Define mail options interface
interface MailOptions {
    from: EmailSender | string;
    to: EmailSender | string;
    subject: string;
    text: string;
    html: string;
    replyTo?: EmailSender | string;
}

// More specific type for accepted/rejected arrays
type EmailAddress = string | EmailSender;

interface EmailResult {
    accepted: EmailAddress[];
    rejected: EmailAddress[];
    messageId?: string;
}

/**
 * Send an email using the configured SMTP transport
 */
export const sendEmail = async (
    sender: EmailSender | string,
    recipient: EmailSender | string,
    subject: string,
    text: string,
    html: string,
    replyTo?: EmailSender | string
): Promise<EmailResult> => {
    console.log('Attempting to send email:', {
        from: sender,
        to: recipient,
        replyTo: replyTo || 'not specified',
        subject,
        textLength: text.length,
    });

    // For testing: Try alternative format for 'from' field that might work with Mailtrap
    const senderStr = typeof sender === 'string' ? sender : `"${sender.name}" <${sender.address}>`;
    const recipientStr = typeof recipient === 'string' ? recipient : `"${recipient.name}" <${recipient.address}>`;
    const replyToStr = !replyTo ? undefined :
        typeof replyTo === 'string' ? replyTo :
            `"${replyTo.name}" <${replyTo.address}>`;

    console.log('Using format:', {
        from: senderStr,
        to: recipientStr,
        replyTo: replyToStr,
    });

    try {
        // Try with the alternative string format which sometimes works better with email services
        const mailOptions: MailOptions = {
            from: senderStr,
            to: recipientStr,
            subject,
            text,
            html,
        };

        // Add reply-to if specified
        if (replyToStr) {
            mailOptions.replyTo = replyToStr;
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully: %s', info.messageId);
        // Use getTestMessageUrl only for ethereal/test emails
        if (info.messageId && typeof nodemailer.getTestMessageUrl === 'function') {
            const testUrl = nodemailer.getTestMessageUrl(info);
            if (testUrl) console.log('Preview URL: %s', testUrl);
        }
        console.log('Delivery info:', {
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
            envelope: info.envelope
        });

        return {
            accepted: info.accepted || [],
            rejected: info.rejected || [],
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending email:');
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        } else {
            console.error('Unknown error type:', error);
        }
        throw error;
    }
};