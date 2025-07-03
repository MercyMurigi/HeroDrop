'use server';
/**
 * @fileOverview An AI flow to send a direct SMS message.
 *
 * - sendBroadcastSms - A function that sends a given message to a given phone number.
 */

import {ai} from '@/ai/genkit';
import { sendSms } from '@/services/sms-service';
import { SendBroadcastSmsInput, SendBroadcastSmsInputSchema, SendBroadcastSmsOutput, SendBroadcastSmsOutputSchema } from '../schemas/broadcast';

export async function sendBroadcastSms(input: SendBroadcastSmsInput): Promise<SendBroadcastSmsOutput> {
  return sendBroadcastSmsFlow(input);
}

const sendBroadcastSmsFlow = ai.defineFlow(
  {
    name: 'sendBroadcastSmsFlow',
    inputSchema: SendBroadcastSmsInputSchema,
    outputSchema: SendBroadcastSmsOutputSchema,
  },
  async (input) => {
    try {
        await sendSms({to: input.phone, message: input.message});
        return { success: true, message: "SMS sent successfully." };
    } catch (error) {
        console.error("Broadcast SMS failed:", error);
        return { success: false, message: "Failed to send SMS." };
    }
  }
);
