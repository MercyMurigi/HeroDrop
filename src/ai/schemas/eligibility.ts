/**
 * @fileOverview Zod schemas and TypeScript types for the blood donation eligibility check.
 */
import {z} from 'zod';

export const CheckEligibilityInputSchema = z.object({
    feelingWell: z.enum(['yes', 'no']),
    fever: z.enum(['yes', 'no']),
    weightLoss: z.enum(['yes', 'no']),
    malaria: z.enum(['yes', 'no']),
    typhoid: z.enum(['yes', 'no']),
    surgery: z.enum(['yes', 'no']),
    hiv: z.enum(['yes', 'no']),
    sti: z.enum(['yes', 'no']),
    covid: z.enum(['yes', 'no']),
    medication: z.enum(['yes', 'no']),
    medicationList: z.string().optional(),
    vaccine: z.enum(['yes', 'no']),
    pregnant: z.enum(['yes', 'no']),
    gaveBirth: z.enum(['yes', 'no']),
    breastfeeding: z.enum(['yes', 'no']),
    newPartner: z.enum(['yes', 'no']),
    injectedDrugs: z.enum(['yes', 'no']),
    paidForBlood: z.enum(['yes', 'no']),
});
export type CheckEligibilityInput = z.infer<typeof CheckEligibilityInputSchema>;

export const CheckEligibilityOutputSchema = z.object({
  isEligible: z.boolean().describe('Whether the user is eligible to donate blood.'),
  feedback: z.string().describe('A clear, concise, and friendly explanation for the eligibility decision. If ineligible, state the primary reason.'),
});
export type CheckEligibilityOutput = z.infer<typeof CheckEligibilityOutputSchema>;
