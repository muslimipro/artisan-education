import { sendEmail } from "@/app/utils/mail.utils";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    console.log('Email API route called');
    try {
        // Parse form data from request
        const formData = await request.json();
        console.log('Received form data:', {
            name: formData.name,
            email: formData.email,
            messageLength: formData.message?.length || 0
        });

        // Validate required fields
        if (!formData.email || !formData.name || !formData.message) {
            console.error('Missing required form fields', { formData });
            return NextResponse.json(
                { success: false, error: 'Missing required form fields' },
                { status: 400 }
            );
        }

        // Use the Mailtrap verified demo domain for sending
        // This domain is already configured in Mailtrap's system
        const sender = {
            name: 'Artisan Education Contact Form',
            address: 'contact@demomailtrap.co',
        };

        // Set reply-to to the user's email address
        const replyTo = {
            name: formData.name,
            address: formData.email,
        };

        // Get recipient email from data.json file
        let recipientEmail;
        try {
            // Read the data.json file
            const dataFilePath = path.join(process.cwd(), 'public', 'data.json');
            const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');
            const data = JSON.parse(dataFileContent);

            // Extract the email from contactInfo
            recipientEmail = data.contactInfo.email;
            console.log('Retrieved recipient email from data.json:', recipientEmail);
        } catch (error) {
            console.error('Error reading email from data.json:', error);
            // Fallback to a default email if there's an error
            recipientEmail = 'muslim.ipro@gmail.com';
            console.log('Using fallback email address:', recipientEmail);
        }

        // For testing, add an additional Mailtrap inbox email to confirm delivery
        // Only if we're not already sending to multiple recipients
        let recipients = recipientEmail;
        if (!recipientEmail.includes(',')) {
            // Add a test recipient to verify email is being sent
            // This will create a copy in Mailtrap's interface for debugging
            recipients = `${recipientEmail},test-${Date.now()}@inbox.mailtrap.io`;
        }

        // For testing: Try both object and string formats for the recipient
        const recipient = recipients; // Use the string directly with multiple recipients

        console.log('Using sender:', sender);
        console.log('Using reply-to:', replyTo);
        console.log('Using recipient(s):', recipient);
        console.log('Environment variables check:', {
            EMAIL_TO: process.env.EMAIL_TO,
            NODE_ENV: process.env.NODE_ENV
        });

        // Format email body
        const messageBody = `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

----
Debug info:
Timestamp: ${new Date().toISOString()}
Server: ${process.env.EMAIL_HOST || 'unknown'}
        `;

        // Format HTML version
        const htmlBody = `
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Message:</strong></p>
<p>${formData.message.replace(/\n/g, '<br>')}</p>
<hr>
<p><small>Debug info: Timestamp: ${new Date().toISOString()}<br>
Server: ${process.env.EMAIL_HOST || 'unknown'}</small></p>
        `;

        // Send email
        console.log('Calling sendEmail function...');

        try {
            console.log('Attempting email delivery...');
            const result = await sendEmail(
                sender,
                recipient,
                "New message from contact form",
                messageBody,
                htmlBody,
                replyTo
            );
            console.log('Email sent successfully, result:', result);

            return NextResponse.json({
                success: true,
                messageId: result.messageId,
                recipient: recipients,
                accepted: result.accepted,
                rejected: result.rejected
            });
        } catch (emailError) {
            console.error('Error in email sending:', emailError);

            // Try alternative approach with direct string recipient
            console.log('Trying alternative approach with different format...');
            // Try with a simplified recipient format just to one email
            const altResult = await sendEmail(
                `"${sender.name}" <${sender.address}>`,
                recipientEmail.split(',')[0], // Just use the first email
                "New message from contact form (alt method)",
                messageBody,
                htmlBody,
                `"${replyTo.name}" <${replyTo.address}>`
            );

            console.log('Alternative email approach succeeded, result:', altResult);
            return NextResponse.json({
                success: true,
                altMethod: true,
                messageId: altResult.messageId,
                recipient: recipientEmail.split(',')[0],
                accepted: altResult.accepted,
                rejected: altResult.rejected
            });
        }
    } catch (error) {
        console.error('Error in email route:');
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        } else {
            console.error('Unknown error type:', error);
        }

        // Return error response with more details
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send email',
                errorType: error instanceof Error ? error.name : 'Unknown',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}