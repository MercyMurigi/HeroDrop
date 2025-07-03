'use server';
/**
 * @fileOverview An AI-powered flow to check blood donation eligibility.
 *
 * - checkEligibility - A function that evaluates a user's answers to a medical questionnaire.
 */

import {ai} from '@/ai/genkit';
import {
  CheckEligibilityInput,
  CheckEligibilityInputSchema,
  CheckEligibilityOutput,
  CheckEligibilityOutputSchema,
} from '@/ai/schemas/eligibility';


export async function checkEligibility(input: CheckEligibilityInput): Promise<CheckEligibilityOutput> {
  return checkEligibilityFlow(input);
}

const eligibilityPrompt = ai.definePrompt({
  name: 'eligibilityPrompt',
  input: {schema: CheckEligibilityInputSchema},
  output: {schema: CheckEligibilityOutputSchema},
  prompt: `You are a medical assistant reviewing a blood donor's pre-screening questionnaire. Your task is to determine if the donor is eligible based on the following critical criteria for blood donation in Kenya.

Donation is NOT ALLOWED if the user answers 'yes' to any of the following:
- Tested positive for HIV/AIDS.
- Is currently taking disqualifying medication (e.g., antibiotics, blood thinners). For this prompt, assume any listed medication is a potential disqualifier unless it's a common over-the-counter painkiller like paracetamol.
- Is currently pregnant.
- Is breastfeeding.

Based on the user's answers below, determine their eligibility. Set 'isEligible' to true or false. Provide a 'feedback' message that is clear, friendly, and explains the decision. If they are ineligible, state the primary reason clearly. If they are eligible, provide a confirmation message.

User's Answers:
- Tested positive for HIV/AIDS? {{{hiv}}}
- Taking medication? {{{medication}}}
- List of medications: {{{medicationList}}}
- Currently pregnant? {{{pregnant}}}
- Breastfeeding? {{{breastfeeding}}}
`,
});

const checkEligibilityFlow = ai.defineFlow(
  {
    name: 'checkEligibilityFlow',
    inputSchema: CheckEligibilityInputSchema,
    outputSchema: CheckEligibilityOutputSchema,
  },
  async (input) => {
    const {output} = await eligibilityPrompt(input);
    return output!;
  }
);
