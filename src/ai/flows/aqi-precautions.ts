'use server';

/**
 * @fileOverview Provides precautions based on the predicted AQI for a given city.
 *
 * - `getAqiPrecautions` -  A function that suggests precautions based on the predicted AQI.
 * - `AqiPrecautionsInput` - The input type for the `getAqiPrecautions` function.
 * - `AqiPrecautionsOutput` - The return type for the `getAqiPrecautions` function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AqiPrecautionsInputSchema = z.object({
  city: z.string().describe('The city for which to provide AQI precautions.'),
  predictedAqi: z.number().describe('The predicted AQI value for the next day.'),
});
export type AqiPrecautionsInput = z.infer<typeof AqiPrecautionsInputSchema>;

const AqiPrecautionsOutputSchema = z.object({
  precautions: z
    .string()
    .describe('A list of precautions to take based on the predicted AQI.'),
});
export type AqiPrecautionsOutput = z.infer<typeof AqiPrecautionsOutputSchema>;

export async function getAqiPrecautions(input: AqiPrecautionsInput): Promise<AqiPrecautionsOutput> {
  return aqiPrecautionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aqiPrecautionsPrompt',
  input: {
    schema: z.object({
      city: z.string().describe('The city for which to provide AQI precautions.'),
      predictedAqi: z.number().describe('The predicted AQI value for the next day.'),
    }),
  },
  output: {
    schema: z.object({
      precautions: z
        .string()
        .describe('A list of precautions to take based on the predicted AQI.'),
    }),
  },
  prompt: `Based on the predicted AQI for {{city}}, which is {{predictedAqi}}, suggest some precautions a user can take to protect themselves from the air pollution.  Explain what AQI means to an average person with no science background.

  Be specific in your answer and give practical advice.
  Limit your response to 100 words.
  `,
});

const aqiPrecautionsFlow = ai.defineFlow<typeof AqiPrecautionsInputSchema, typeof AqiPrecautionsOutputSchema>(
  {
    name: 'aqiPrecautionsFlow',
    inputSchema: AqiPrecautionsInputSchema,
    outputSchema: AqiPrecautionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
