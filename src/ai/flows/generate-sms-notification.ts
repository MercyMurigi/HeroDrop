'use server';

/**
 * @fileOverview Generates SMS notifications with dynamic content, including DamuToken balance based on notification type.
 *
 * - generateSmsNotification - A function that generates and sends SMS notifications.
 */

import {ai} from '@/ai/genkit';
import { sendSms } from '@/services/sms-service';
import {
  GenerateSmsNotificationInput,
  GenerateSmsNotificationInputSchema,
  GenerateSmsNotificationOutput,
  GenerateSmsNotificationOutputSchema
} from "@/ai/schemas/sms";


export async function generateSmsNotification(
  input: GenerateSmsNotificationInput
): Promise<GenerateSmsNotificationOutput> {
  return generateSmsNotificationFlow(input);
}

const generateSmsNotificationPrompt = ai.definePrompt({
  name: 'generateSmsNotificationPrompt',
  input: {schema: GenerateSmsNotificationInputSchema},
  output: {schema: GenerateSmsNotificationOutputSchema},
  prompt: `You are an expert SMS notification generator for HeroDrop+,
a blood donation platform that rewards donors with DamuTokens.

Generate an SMS message based on the following information:

Notification Type: {{{notificationType}}}
User Name: {{{userName}}}
Token Balance: {{{tokenBalance}}}
Service Redeemed: {{{serviceRedeemed}}}
Redemption Code: {{{redemptionCode}}}
Appointment Time: {{{appointmentTime}}}
Hospital Name: {{{hospitalName}}}
Suggested Time: {{{suggestedTime}}}

Include the token balance in the SMS message only for 'rewards' and 'redemption' notifications.
Omit it for 'reminder' and 'confirmation' notifications.

Here are example SMS notifications:

Rewards: '👏🏽 Congrats, {{{userName}}}! You’ve earned 100 DamuTokens. Total balance: {{{tokenBalance}}} DT. Redeem now at damuhero.co.ke/redeem'
Redemption: '🎉 {{{userName}}}, you've redeemed {{{serviceRedeemed}}}. Code: {{{redemptionCode}}}. Best time to visit: {{{suggestedTime}}}. Balance: {{{tokenBalance}}} DT.'
Reminder: '🔔 Hi {{{userName}}}, your appointment at {{{hospitalName}}} is scheduled for {{{appointmentTime}}}.'
Confirmation: '✅ Hi {{{userName}}}, your appointment at {{{hospitalName}}} on {{{appointmentTime}}} has been confirmed.'

Make sure to include the appropriate emojis.

SMS Message:`,
});

const generateSmsNotificationFlow = ai.defineFlow(
  {
    name: 'generateSmsNotificationFlow',
    inputSchema: GenerateSmsNotificationInputSchema,
    outputSchema: GenerateSmsNotificationOutputSchema,
  },
  async input => {
    const {output} = await generateSmsNotificationPrompt(input);
    
    if (output?.smsMessage) {
        try {
            await sendSms({ to: input.phone, message: output.smsMessage });
        } catch (error) {
            console.error('Failed to send SMS in flow:', error);
            // Optionally, you can decide if the flow should fail here or just log the error.
            // For now, we'll let it continue and just return the generated message.
        }
    }
    
    return output!;
  }
);
