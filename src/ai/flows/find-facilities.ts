'use server';
/**
 * @fileOverview An AI-powered flow to find and rank blood donation facilities.
 *
 * - findFacilities - A function that matches a user's location query to a list of facilities.
 * - FindFacilitiesInput - The input type for the findFacilities function.
 * - FindFacilitiesOutput - The return type for the findFacilities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindFacilitiesInputSchema = z.object({
  locationQuery: z.string().describe('The user\'s location search query, which may contain typos or be informal.'),
});
export type FindFacilitiesInput = z.infer<typeof FindFacilitiesInputSchema>;

const FacilitySchema = z.object({
  name: z.string().describe('The name of the donation facility.'),
  address: z.string().describe('The full address of the facility.'),
  distance: z.string().describe('A reasonable estimate of the distance from the user\'s query location, in kilometers (e.g., "5 km").'),
  availability: z.enum(['High', 'Medium', 'Low']).describe('The current availability for booking appointments at this facility.'),
});

const FindFacilitiesOutputSchema = z.object({
    facilities: z.array(FacilitySchema).describe('A ranked list of matching donation facilities.'),
});
export type FindFacilitiesOutput = z.infer<typeof FindFacilitiesOutputSchema>;

export async function findFacilities(input: FindFacilitiesInput): Promise<FindFacilitiesOutput> {
  return findFacilitiesFlow(input);
}

const findFacilitiesPrompt = ai.definePrompt({
  name: 'findFacilitiesPrompt',
  input: {schema: FindFacilitiesInputSchema},
  output: {schema: FindFacilitiesOutputSchema},
  prompt: `You are an intelligent assistant for the HeroDrop+ blood donation platform. Your task is to find and rank donation facilities based on a user's location query.

You must interpret informal location names, slang, and typos. For example, "KNH" should be matched to "Kenyatta National Hospital". A query like "town" in Nairobi should match facilities in the central business district.

Here is the list of available facilities you can match against:
- Kenyatta National Hospital, Hospital Road, Nairobi. Availability: High
- Moi Teaching & Referral, Nandi Road, Eldoret. Availability: Medium
- Aga Khan University Hospital, 3rd Parklands Avenue, Nairobi. Availability: High
- Coast General Hospital, Kisauni Road, Mombasa. Availability: Low
- Jaramogi Oginga Odinga T&R, Kisumu-Busia Road, Kisumu. Availability: Medium
- Mama Lucy Kibaki Hospital, Spine Road, Nairobi. Availability: High

User's location query: "{{locationQuery}}"

Based on the query, return a ranked list of the most relevant facilities from the list above. For each facility, provide its official name, full address, a reasonable estimated distance in a string format (e.g., "approx. 5 km"), and its current availability status. If no facilities match, return an empty list.`,
});

const findFacilitiesFlow = ai.defineFlow(
  {
    name: 'findFacilitiesFlow',
    inputSchema: FindFacilitiesInputSchema,
    outputSchema: FindFacilitiesOutputSchema,
  },
  async input => {
    const {output} = await findFacilitiesPrompt(input);
    return output || { facilities: [] };
  }
);
