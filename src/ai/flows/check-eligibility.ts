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
  prompt: `You are a medical assistant reviewing a blood donor's pre-screening questionnaire. Your task is to determine if the donor is eligible based on the following standard criteria for blood donation in Kenya.

Donation is NOT ALLOWED if the user answers 'yes' to any of the following:
- Had a fever in the past 7 days.
- Recently experienced unexplained weight loss or fatigue.
- Had malaria in the last 3 months.
- Had typhoid, TB, or hepatitis recently.
- Had surgery in the past 6 months.
- Tested positive for HIV/AIDS.
- Has any known sexually transmitted infections.
- Received any vaccines in the last 4 weeks.
- Is currently pregnant.
- Gave birth in the past 6 months.
- Is breastfeeding.
- Has had a new sexual partner in the last 6 months.
- Has ever injected drugs not prescribed by a doctor.
- Has ever been paid to donate or receive blood.
- Is currently taking disqualifying medication (e.g., antibiotics, blood thinners). For this prompt, assume any listed medication is a potential disqualifier unless it's a common over-the-counter painkiller like paracetamol.

Donation is NOT ALLOWED if the user answers 'no' to the following:
- Feeling well today.

Based on the user's answers below, determine their eligibility. Set 'isEligible' to true or false. Provide a 'feedback' message that is clear, friendly, and explains the decision. If they are ineligible, state the primary reason clearly. If they are eligible, provide a confirmation message.

User's Answers:
- Feeling well today? {{{feelingWell}}}
- Had a fever in the past 7 days? {{{fever}}}
- Unexplained weight loss or fatigue? {{{weightLoss}}}
- Malaria in last 3 months? {{{malaria}}}
- Typhoid, TB, or hepatitis recently? {{{typhoid}}}
- Surgery in past 6 months? {{{surgery}}}
- Tested positive for HIV/AIDS? {{{hiv}}}
- Known STIs? {{{sti}}}
- Exposed to COVID-19 recently? {{{covid}}}
- Taking medication? {{{medication}}}
- List of medications: {{{medicationList}}}
- Received vaccine in last 4 weeks? {{{vaccine}}}
- Currently pregnant? {{{pregnant}}}
- Given birth in past 6 months? {{{gaveBirth}}}
- Breastfeeding? {{{breastfeeding}}}
- New sexual partner in last 6 months? {{{newPartner}}}
- Injected non-prescribed drugs? {{{injectedDrugs}}}
- Paid for blood? {{{paidForBlood}}}
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
