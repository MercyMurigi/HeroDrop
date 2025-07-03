/**
 * @fileOverview Zod schemas and TypeScript types for generating SMS notifications.
 */
import {z} from 'zod';

export const GenerateSmsNotificationInputSchema = z.object({
  notificationType: z
    .enum(['reminder', 'confirmation', 'rewards', 'redemption'])
    .describe('The type of SMS notification to send.'),
  userName: z.string().describe('The name of the user receiving the notification.'),
  tokenBalance: z.number().describe('The current DamuToken balance of the user.'),
  serviceRedeemed: z.string().optional().describe('The service redeemed, if applicable.'),
  redemptionCode: z.string().optional().describe('The redemption code, if applicable.'),
  appointmentTime: z.string().optional().describe('The appointment time, if applicable.'),
  hospitalName: z.string().optional().describe('The name of the hospital for the appointment, if applicable.'),
  suggestedTime: z.string().optional().describe('A suggested time for the user to visit for their redemption.'),
});
export type GenerateSmsNotificationInput = z.infer<typeof GenerateSmsNotificationInputSchema>;

export const GenerateSmsNotificationOutputSchema = z.object({
  smsMessage: z.string().describe('The generated SMS message.'),
});
export type GenerateSmsNotificationOutput = z.infer<typeof GenerateSmsNotificationOutputSchema>;
