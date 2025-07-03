'use server';

/**
 * @fileOverview Generates SMS notifications with dynamic content, including DamuToken balance based on notification type.
 *
 * - generateSmsNotification - A function that generates SMS notifications.
 * - GenerateSmsNotificationInput - The input type for the generateSmsNotification function.
 * - GenerateSmsNotificationOutput - The return type for the generateSmsNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmsNotificationInputSchema = z.object({
  notificationType: z
    .enum(['reminder', 'confirmation', 'rewards', 'redemption'])
    .describe('The type of SMS notification to send.'),
  userName: z.string().describe('The name of the user receiving the notification.'),
  tokenBalance: z.number().describe('The current DamuToken balance of the user.'),
  serviceRedeemed: z.string().optional().describe('The service redeemed, if applicable.'),
  redemptionCode: z.string().optional().describe('The redemption code, if applicable.'),
  appointmentTime: z.string().optional().describe('The appointment time, if applicable.'),
  hospitalName: z.string().optional().describe('The name of the hospital for the appointment, if applicable.'),
});
export type GenerateSmsNotificationInput = z.infer<typeof GenerateSmsNotificationInputSchema>;

const GenerateSmsNotificationOutputSchema = z.object({
  smsMessage: z.string().describe('The generated SMS message.'),
});
export type GenerateSmsNotificationOutput = z.infer<typeof GenerateSmsNotificationOutputSchema>;

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
