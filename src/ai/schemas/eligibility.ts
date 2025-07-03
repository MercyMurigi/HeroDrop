/**
 * @fileOverview Zod schemas and TypeScript types for the blood donation eligibility check.
 */
import {z} from 'zod';

export const CheckEligibilityInputSchema = z.object({
    hiv: z.enum(['yes', 'no']),
    medication: z.enum(['yes', 'no']),
    medicationList: z.string().optional(),
    pregnant: z.enum(['yes', 'no']),
    breastfeeding: z.enum(['yes', 'no']),
});
export type CheckEligibilityInput = z.infer<typeof CheckEligibilityInputSchema>;

export const CheckEligibilityOutputSchema = z.object({
  isEligible: z.boolean().describe('Whether the user is eligible to donate blood.'),
  feedback: z.string().describe('A clear, concise, and friendly explanation for the eligibility decision. If ineligible, state the primary reason.'),
});
export type CheckEligibilityOutput = z.infer<typeof CheckEligibilityOutputSchema>;
