'use server';

import AfricasTalking from 'africastalking';

// Make sure to have AFRICASTALKING_USERNAME and AFRICASTALKING_API_KEY in your .env file
const username = process.env.AFRICASTALKING_USERNAME;
const apiKey = process.env.AFRICASTALKING_API_KEY;

if (!username || !apiKey) {
    console.warn("Africa's Talking credentials are not set in .env file. SMS sending will be disabled.");
}

const africasTalking = AfricasTalking({
    apiKey: apiKey || 'dummy',
    username: username || 'dummy',
});

const sms = africasTalking.SMS;

interface SendSmsParams {
    to: string | string[];
    message: string;
}

export async function sendSms({ to, message }: SendSmsParams): Promise<any> {
    if (!username || !apiKey) {
        // Log to console in dev environments instead of sending
        console.log("--- SMS Not Sent (No API credentials) ---");
        console.log("To:", to);
        console.log("Message:", message);
        console.log("------------------------------------------");
        // Return a mock success response
        return {
            SMSMessageData: {
                Message: "Sent to 1/1 Total Cost: KES 0.0000",
                Recipients: [
                    {
                        statusCode: 101,
                        number: Array.isArray(to) ? to.join(',') : to,
                        cost: "KES 0.0000",
                        status: "Success",
                        messageId: `ATXid_${Date.now()}`
                    }
                ]
            }
        };
    }

    try {
        // You might need to register an Alphanumeric sender ID on Africa's Talking
        // or use a shortcode you have subscribed to. Using 'AFRICASTKNG' for sandbox.
        const result = await sms.send({ to, message, from: 'AFRICASTKNG' }); 
        console.log('SMS sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS via Africa\'s Talking.');
    }
}
