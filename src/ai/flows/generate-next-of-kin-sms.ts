'use server';

/**
 * @fileOverview Generates a supportive SMS notification for a donor's next of kin.
 *
 * - generateNextOfKinSms - A function that generates the SMS.
 */

import {ai} from '@/ai/genkit';
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
Your task is to generate a supportive and informative SMS for a donor's next of kin.

The message should:
1.  Inform the next of kin that their relative, {{{donorName}}}, has scheduled a blood donation.
2.  Mention the hospital name: {{{hospitalName}}}.
3.  Reassure them that this is a routine procedure.
4.  Briefly mention the importance of after-care, like ensuring the donor is hydrated and rests well.
5.  Maintain a friendly and encouraging tone.

Example:
"Hi {{{nextOfKinName}}}, this is HeroDrop+. Your relative, {{{donorName}}}, has bravely scheduled a blood donation at {{{hospitalName}}}. To support them, please ensure they rest and hydrate well after their appointment. Thank you for being a hero's supporter! 🦸"

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
    return output!;
  }
);
