'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CbtReframingCoachInputSchema = z.object({
  situation: z.string().describe('Objective situation the user faced.'),
  automaticThought: z.string().describe('Automatic thought that appeared in the moment.'),
  emotion: z.string().describe('Emotion(s) felt by the user.'),
  userAlternative: z.string().optional().describe('Optional balanced alternative proposed by the user.'),
});
export type CbtReframingCoachInput = z.infer<typeof CbtReframingCoachInputSchema>;

const CbtReframingCoachOutputSchema = z.object({
  distortion: z.string().describe('Likely cognitive distortion present in the automatic thought.'),
  balancedReframe: z.string().describe('A compassionate and realistic reframe grounded in evidence.'),
  actionStep: z.string().describe('One concrete next step the user can do today.'),
});
export type CbtReframingCoachOutput = z.infer<typeof CbtReframingCoachOutputSchema>;

export async function cbtReframingCoach(input: CbtReframingCoachInput): Promise<CbtReframingCoachOutput> {
  return cbtReframingCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cbtReframingCoachPrompt',
  input: { schema: CbtReframingCoachInputSchema },
  output: { schema: CbtReframingCoachOutputSchema },
  prompt: `You are an empathetic CBT coach.

Given the user's input, produce:
1) the likely cognitive distortion,
2) a balanced reframe,
3) one practical next action.

Rules:
- Keep the tone supportive, non-judgmental, and specific.
- Avoid clinical diagnosis language.
- Keep each field concise but meaningful.

Situation: {{{situation}}}
Automatic Thought: {{{automaticThought}}}
Emotion: {{{emotion}}}
User Alternative (optional): {{{userAlternative}}}`,
});

const cbtReframingCoachFlow = ai.defineFlow(
  {
    name: 'cbtReframingCoachFlow',
    inputSchema: CbtReframingCoachInputSchema,
    outputSchema: CbtReframingCoachOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
