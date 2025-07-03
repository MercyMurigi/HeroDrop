/**
 * @fileOverview Zod schemas and TypeScript types for redemption-related AI flows.
 */
import {z} from 'zod';

export const SuggestRedemptionTimeInputSchema = z.object({
  facilityName: z.string().describe('The name of the facility where the service will be redeemed.'),
  serviceName: z.string().describe('The name of the service being redeemed.'),
});
export type SuggestRedemptionTimeInput = z.infer<typeof SuggestRedemptionTimeInputSchema>;

export const SuggestRedemptionTimeOutputSchema = z.object({
    suggestedTime: z.string().describe('A clear, concise suggestion for the best time to visit the facility (e.g., "Weekdays between 2-4 PM").'),
    reasoning: z.string().describe('A brief explanation for the suggested time (e.g., "This is typically when the lab has fewer appointments.").'),
});
export type SuggestRedemptionTimeOutput = z.infer<typeof SuggestRedemptionTimeOutputSchema>;
