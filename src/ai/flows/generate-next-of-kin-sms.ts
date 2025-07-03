'use server';

/**
 * @fileOverview Generates a supportive SMS notification for a donor's next of kin.
 *
 * - generateNextOfKinSms - A function that generates and sends the SMS.
 */

import {ai} from '@/ai/genkit';
import { sendSms } from '@/services/sms-service';
import {
  GenerateNextOfKinSmsInput,
  GenerateNextOfKinSmsInputSchema,
  GenerateNextOfKinSmsOutput,
  GenerateNextOfKinSmsOutputSchema
} from "@/ai/schemas/next-of-kin-sms";


export async function generateNextOfKinSms(
  input: GenerateNextOfKinSmsInput
): Promise<GenerateNextOfKinSmsOutput> {
  return generateNextOfKinSmsFlow(input);
}

const generateNextOfKinSmsPrompt = ai.definePrompt({
  name: 'generateNextOfKinSmsPrompt',
  input: {schema: GenerateNextOfKinSmsInputSchema},
  output: {schema: GenerateNextOfKinSmsOutputSchema},
  prompt: `You are an assistant for HeroDrop+, a blood donation platform.
Your task is to generate a supportive and informative SMS for a donor's next of kin, notifying them that the donation is complete.

The message should:
1.  Congratulate the next of kin that their relative, {{{donorName}}}, has successfully donated blood.
2.  Mention the hospital name: {{{hospitalName}}}.
3.  Emphasize the importance of after-care, like ensuring the donor is hydrated and rests well.
4.  Maintain a celebratory, friendly, and encouraging tone.

Example:
"Hi {{{nextOfKinName}}}, great news from HeroDrop+! Your relative, {{{donorName}}}, has just completed their donation at {{{hospitalName}}}. They're a true hero! Please help them rest and hydrate well. Thank you for supporting a lifesaver! ❤️"

Generate the SMS message based on the input.
`,
});

const generateNextOfKinSmsFlow = ai.defineFlow(
  {
    name: 'generateNextOfKinSmsFlow',
    inputSchema: GenerateNextOfKinSmsInputSchema,
    outputSchema: GenerateNextOfKinSmsOutputSchema,
  },
  async input => {
    const {output} = await generateNextOfKinSmsPrompt(input);
    
    if (output?.smsMessage) {
        try {
            await sendSms({ to: input.nextOfKinPhone, message: output.smsMessage });
        } catch (error) {
            console.error('Failed to send Next of Kin SMS in flow:', error);
        }
    }

    return output!;
  }
);
