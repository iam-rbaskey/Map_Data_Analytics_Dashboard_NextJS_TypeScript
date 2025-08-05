
'use server';


import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateDataAveragesInputSchema = z.object({
  polygonId: z.string().describe('The unique identifier of the polygon.'),
  currentData: z.array(z.number()).describe('The current data values in the polygon.'),
  newData: z.array(z.number()).describe('The new data values to consider for updating averages.'),
  threshold: z.number().describe('The threshold for significant change to trigger an update.'),
});

export type UpdateDataAveragesInput = z.infer<typeof UpdateDataAveragesInputSchema>;

const UpdateDataAveragesOutputSchema = z.object({
  updatedData: z.array(z.number()).describe('The updated data values after intelligent averaging.'),
  significantChanges: z.boolean().describe('Indicates if significant changes were detected and data was updated.'),
});

export type UpdateDataAveragesOutput = z.infer<typeof UpdateDataAveragesOutputSchema>;

export async function updateDataAverages(input: UpdateDataAveragesInput): Promise<UpdateDataAveragesOutput> {
  return updateDataAveragesFlow(input);
}

const updateDataAveragesPrompt = ai.definePrompt({
  name: 'updateDataAveragesPrompt',
  input: {schema: UpdateDataAveragesInputSchema},
  output: {schema: UpdateDataAveragesOutputSchema},
  prompt: `test`,
});

const updateDataAveragesFlow = ai.defineFlow(
  {
    name: 'updateDataAveragesFlow',
    inputSchema: UpdateDataAveragesInputSchema,
    outputSchema: UpdateDataAveragesOutputSchema,
  },
  async input => {
    const {output} = await updateDataAveragesPrompt(input);
    return output!;
  }
);
