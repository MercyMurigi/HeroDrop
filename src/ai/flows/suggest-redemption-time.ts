'use server';
/**
 * @fileOverview An AI-powered flow to suggest the best time to visit a hospital for a service.
 *
 * - suggestRedemptionTime - A function that suggests an optimal time to visit a facility.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestRedemptionTimeInput,
  SuggestRedemptionTimeInputSchema,
  SuggestRedemptionTimeOutput,
  SuggestRedemptionTimeOutputSchema
} from "@/ai/schemas/redemption";

export async function suggestRedemptionTime(input: SuggestRedemptionTimeInput): Promise<SuggestRedemptionTimeOutput> {
  return suggestRedemptionTimeFlow(input);
}

const suggestRedemptionTimePrompt = ai.definePrompt({
  name: 'suggestRedemptionTimePrompt',
  input: {schema: SuggestRedemptionTimeInputSchema},
  output: {schema: SuggestRedemptionTimeOutputSchema},
  prompt: `You are an intelligent assistant for the HeroDrop+ platform. Your task is to suggest the best time for a user to visit a specific hospital to redeem a service, aiming to minimize their wait time.

Consider the type of hospital (large public hospitals are generally busier than smaller private ones) and the nature of the service. For example, lab tests are often busiest in the mornings.

User wants to redeem: "{{serviceName}}"
At this facility: "{{facilityName}}"

Here is some context on hospitals in Kenya. Use this to inform your suggestion:
- Large public referral hospitals like Kenyatta National Hospital, Moi Teaching & Referral, and Coast General are very busy, especially in the mornings (8 AM - 1 PM). Afternoons are often better.
- Private hospitals like Aga Khan, Nairobi Hospital, and Karen Hospital are generally well-organized, but specialty clinics can have specific busy hours.
- Lab services are almost always busiest in the early morning due to fasting requirements. Suggesting an afternoon visit is usually a safe bet.
- General checkups and counseling sessions are more flexible. Suggesting mid-morning (e.g., 10-11 AM) or mid-afternoon (2-4 PM) on a weekday is a good strategy to avoid peak times.

Based on this, provide a concise 'suggestedTime' (e.g., "Weekdays, 2-4 PM") and a brief 'reasoning' for your suggestion.`,
});

const suggestRedemptionTimeFlow = ai.defineFlow(
  {
    name: 'suggestRedemptionTimeFlow',
    inputSchema: SuggestRedemptionTimeInputSchema,
    outputSchema: SuggestRedemptionTimeOutputSchema,
  },
  async input => {
    const {output} = await suggestRedemptionTimePrompt(input);
    return output!;
  }
);
