'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IkigaiInsightGeneratorInputSchema = z.object({
  whatYouLove: z.string().describe('User reflections on what they love.'),
  whatYouAreGoodAt: z.string().describe('User reflections on strengths and skills.'),
  whatWorldNeeds: z.string().describe('User reflections on what impact they care about.'),
  whatYouCanBePaidFor: z.string().describe('User reflections on monetizable paths.'),
});
export type IkigaiInsightGeneratorInput = z.infer<typeof IkigaiInsightGeneratorInputSchema>;

const IkigaiInsightGeneratorOutputSchema = z.object({
  ikigaiStatement: z.string().describe('A one-paragraph practical Ikigai statement tailored to the user.'),
  direction: z.string().describe('A realistic direction that integrates purpose with constraints.'),
  nextSteps: z.array(z.string()).length(3).describe('Exactly 3 practical next steps the user can start this week.'),
});
export type IkigaiInsightGeneratorOutput = z.infer<typeof IkigaiInsightGeneratorOutputSchema>;

export async function ikigaiInsightGenerator(input: IkigaiInsightGeneratorInput): Promise<IkigaiInsightGeneratorOutput> {
  return ikigaiInsightGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ikigaiInsightGeneratorPrompt',
  input: { schema: IkigaiInsightGeneratorInputSchema },
  output: { schema: IkigaiInsightGeneratorOutputSchema },
  prompt: `You are an Ikigai coach. Generate specific and useful output, not generic motivation.

Use the four dimensions to synthesize a practical direction:
- What they love
- What they are good at
- What the world needs
- What they can be paid for

Rules:
- Ground every suggestion in the provided responses.
- Be concrete and realistic.
- Avoid vague advice.
- Provide exactly 3 next steps.

What they love:
{{{whatYouLove}}}

What they are good at:
{{{whatYouAreGoodAt}}}

What the world needs:
{{{whatWorldNeeds}}}

What they can be paid for:
{{{whatYouCanBePaidFor}}}`,
});

const ikigaiInsightGeneratorFlow = ai.defineFlow(
  {
    name: 'ikigaiInsightGeneratorFlow',
    inputSchema: IkigaiInsightGeneratorInputSchema,
    outputSchema: IkigaiInsightGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
