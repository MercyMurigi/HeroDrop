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

Here is the list of available facilities you can match against across all 47 counties of Kenya:

**Nairobi County:**
- Kenyatta National Hospital, Hospital Road, Nairobi. Availability: High
- Aga Khan University Hospital, 3rd Parklands Avenue, Nairobi. Availability: High
- Mama Lucy Kibaki Hospital, Spine Road, Nairobi. Availability: High
- The Nairobi Hospital, Argwings Kodhek Rd, Nairobi. Availability: Medium
- M.P. Shah Hospital, Shivachi Rd, Nairobi. Availability: Low

**Mombasa County:**
- Coast General Teaching & Referral Hospital, Kisauni Road, Mombasa. Availability: Low
- Pandya Memorial Hospital, Dedan Kimathi Ave, Mombasa. Availability: Medium
- The Mombasa Hospital, Mama Ngina Dr, Mombasa. Availability: High

**Kisumu County:**
- Jaramogi Oginga Odinga Teaching & Referral Hospital, Kisumu-Busia Road, Kisumu. Availability: Medium
- Aga Khan Hospital, Otieno Oyoo St, Kisumu. Availability: High
- Kisumu County Hospital, Ang'awa Ave, Kisumu. Availability: Medium

**Uasin Gishu County:**
- Moi Teaching & Referral Hospital, Nandi Road, Eldoret. Availability: Medium
- Reale Hospital, Eldoret-Kapsabet Road, Eldoret. Availability: High
- Eldoret Hospital, Elgon View, Eldoret. Availability: Low

**Nakuru County:**
- Nakuru Level 5 Hospital, Nakuru Town. Availability: High
- The Valley Hospital, Nakuru. Availability: Medium
- War Memorial Hospital, Nakuru. Availability: Low

**Kiambu County:**
- Kiambu Level 5 Hospital, Kiambu Town. Availability: High
- Thika Level 5 Hospital, Thika Town. Availability: Medium
- Nazareth Hospital, Riara Ridge, Limuru. Availability: High

**Machakos County:**
- Machakos Level 5 Hospital, Machakos Town. Availability: Medium
- Shalom Community Hospital, Machakos. Availability: High
- Bishop Kioko Hospital, Machakos. Availability: Low

**Meru County:**
- Meru Level 5 Hospital, Meru Town. Availability: High
- The Karen Hospital, Meru Branch, Meru. Availability: Medium
- St. Theresa's Mission Hospital, Kiirua. Availability: Medium

**Kakamega County:**
- Kakamega County General Hospital, Kakamega Town. Availability: High
- Mukumu Mission Hospital, Khayega. Availability: Low
- St. Mary's Hospital, Mumias. Availability: Medium

**Garissa County:**
- Garissa County Referral Hospital, Garissa. Availability: Medium
- Tawfiq Hospital, Garissa. Availability: Low

**Kajiado County:**
- Kajiado County Referral Hospital, Kajiado Town. Availability: Medium
- Kitengela Medical Services, Kitengela. Availability: High
- Ongata Rongai Health Centre, Ongata Rongai. Availability: Medium

**Kilifi County:**
- Kilifi County Hospital, Kilifi Town. Availability: Low
- Malindi Sub-County Hospital, Malindi. Availability: Medium
- St. Luke's Hospital, Kaloleni. Availability: High

**Kisii County:**
- Kisii Teaching and Referral Hospital, Kisii Town. Availability: High
- Hema Hospital, Kisii. Availability: Medium
- Christamarianne Mission Hospital, Kisii. Availability: Low

**Bungoma County:**
- Bungoma County Referral Hospital, Bungoma Town. Availability: Medium
- LifeCare Hospital, Bungoma. Availability: High
- Webuye Sub-County Hospital, Webuye. Availability: Low

**Nyeri County:**
- Nyeri County Referral Hospital, Nyeri Town. Availability: High
- Outspan Hospital, Nyeri. Availability: Medium
- Consolata Hospital, Mathari, Nyeri. Availability: Low

**Turkana County:**
- Lodwar County Referral Hospital, Lodwar. Availability: Medium
- Kakuma Mission Hospital, Kakuma. Availability: Low

**Other Counties:**
- Mandera County Referral Hospital, Mandera. Availability: Low
- Wajir County Referral Hospital, Wajir. Availability: Low
- Marsabit County Referral Hospital, Marsabit. Availability: Medium
- Isiolo County Referral Hospital, Isiolo. Availability: Medium
- Chuka County Referral Hospital, Chuka, Tharaka-Nithi. Availability: High
- Embu Level 5 Hospital, Embu. Availability: High
- Kitui County Referral Hospital, Kitui. Availability: Medium
- Makueni County Referral Hospital, Wote. Availability: High
- JM Kariuki Memorial Hospital, Ol Kalou, Nyandarua. Availability: High
- Kerugoya County Referral Hospital, Kerugoya, Kirinyaga. Availability: High
- Murang'a County Referral Hospital, Murang'a. Availability: High
- Kapenguria County Referral Hospital, Kapenguria, West Pokot. Availability: Medium
- Maralal County Referral Hospital, Maralal, Samburu. Availability: Low
- Kitale County Referral Hospital, Kitale, Trans-Nzoia. Availability: High
- Iten County Referral Hospital, Iten, Elgeyo-Marakwet. Availability: Medium
- Kapsabet County Referral Hospital, Kapsabet, Nandi. Availability: High
- Kabarnet County Referral Hospital, Kabarnet, Baringo. Availability: Medium
- Nanyuki Teaching and Referral Hospital, Nanyuki, Laikipia. Availability: High
- Narok County Referral Hospital, Narok. Availability: Medium
- Kericho County Referral Hospital, Kericho. Availability: High
- Longisa County Referral Hospital, Bomet. Availability: High
- Vihiga County Referral Hospital, Vihiga. Availability: Medium
- Busia County Referral Hospital, Busia. Availability: Medium
- Siaya County Referral Hospital, Siaya. Availability: High
- Homa Bay County Referral Hospital, Homa Bay. Availability: Medium
- Migori County Referral Hospital, Migori. Availability: Medium
- Nyamira County Referral Hospital, Nyamira. Availability: High
- Msambweni County Referral Hospital, Msambweni, Kwale. Availability: Low
- Hola County Referral Hospital, Hola, Tana River. Availability: Low
- Lamu County Hospital, Lamu. Availability: Low
- Moi County Referral Hospital, Voi, Taita-Taveta. Availability: Medium

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
