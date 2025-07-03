/**
 * @fileOverview Zod schemas and TypeScript types for sending broadcast messages.
 */
import {z} from 'zod';

export const SendBroadcastSmsInputSchema = z.object({
  phone: z.string().describe('The phone number of the user to receive the SMS.'),
  message: z.string().describe('The content of the SMS message to send.'),
});
export type SendBroadcastSmsInput = z.infer<typeof SendBroadcastSmsInputSchema>;

export const SendBroadcastSmsOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendBroadcastSmsOutput = z.infer<typeof SendBroadcastSmsOutputSchema>;
