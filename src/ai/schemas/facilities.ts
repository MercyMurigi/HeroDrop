/**
 * @fileOverview Zod schemas and TypeScript types for finding donation facilities.
 */
import {z} from 'zod';

export const FindFacilitiesInputSchema = z.object({
  locationQuery: z.string().describe('The user\'s location search query, which may contain typos or be informal.'),
});
export type FindFacilitiesInput = z.infer<typeof FindFacilitiesInputSchema>;

export const FacilitySchema = z.object({
  name: z.string().describe('The name of the donation facility.'),
  address: z.string().describe('The full address of the facility.'),
  distance: z.string().describe('A reasonable estimate of the distance from the user\'s query location, in kilometers (e.g., "5 km").'),
  availability: z.enum(['High', 'Medium', 'Low']).describe('The current availability for booking appointments at this facility.'),
});

export const FindFacilitiesOutputSchema = z.object({
    facilities: z.array(FacilitySchema).describe('A ranked list of matching donation facilities.'),
});
export type FindFacilitiesOutput = z.infer<typeof FindFacilitiesOutputSchema>;
