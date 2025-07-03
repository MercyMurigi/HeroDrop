'use server';

/**
 * @fileOverview Generates SMS notifications with dynamic content, including DamuToken balance based on notification type.
 *
 * - generateSmsNotification - A function that generates SMS notifications.
 */

import {ai} from '@/ai/genkit';
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

Include the token balance in the SMS message only for 'rewards' and 'redemption' notifications.
Omit it for 'reminder' and 'confirmation' notifications.

Here are example SMS notifications:

Rewards: '👏🏽 Congrats, {{{userName}}}! You’ve earned 100 DamuTokens. Total balance: {{{tokenBalance}}} DT. Redeem now at damuhero.co.ke/redeem'
Redemption: '🎉 {{{userName}}}, you've redeemed {{{serviceRedeemed}}}! Your redemption code is {{{redemptionCode}}}. Total balance: {{{tokenBalance}}} DT.'
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
    return output!;
  }
);
