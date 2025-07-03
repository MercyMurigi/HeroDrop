/**
 * @fileOverview Zod schemas and TypeScript types for generating SMS notifications for the next of kin.
 */
import {z} from 'zod';

export const GenerateNextOfKinSmsInputSchema = z.object({
  donorName: z.string().describe('The name of the donor.'),
  nextOfKinName: z.string().describe('The name of the next of kin.'),
  nextOfKinPhone: z.string().describe("The phone number of the next of kin to receive the SMS."),
  hospitalName: z.string().describe('The name of the hospital for the appointment.'),
});
export type GenerateNextOfKinSmsInput = z.infer<typeof GenerateNextOfKinSmsInputSchema>;

export const GenerateNextOfKinSmsOutputSchema = z.object({
  smsMessage: z.string().describe('The generated SMS message for the next of kin.'),
});
export type GenerateNextOfKinSmsOutput = z.infer<typeof GenerateNextOfKinSmsOutputSchema>;
