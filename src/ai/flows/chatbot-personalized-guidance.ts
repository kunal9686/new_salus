'use server';
/**
 * @fileOverview An AI agent that provides personalized wellness guidance based on user profile and journal entries.
 *
 * - chatbotPersonalizedGuidance - A function that handles the personalized wellness guidance process.
 * - ChatbotPersonalizedGuidanceInput - The input type for the chatbotPersonalizedGuidance function.
 * - ChatbotPersonalizedGuidanceOutput - The return type for the chatbotPersonalizedGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotPersonalizedGuidanceInputSchema = z.object({
  profile: z.string().describe('User profile information, including wellness goals and preferences.'),
  journalEntries: z.string().describe('A concatenation of the user journal entries.'),
  query: z.string().describe('The user query to the chatbot.'),
});
export type ChatbotPersonalizedGuidanceInput = z.infer<typeof ChatbotPersonalizedGuidanceInputSchema>;

const ChatbotPersonalizedGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Personalized wellness guidance and recommendations based on the user profile and journal entries.'),
});
export type ChatbotPersonalizedGuidanceOutput = z.infer<typeof ChatbotPersonalizedGuidanceOutputSchema>;

export async function chatbotPersonalizedGuidance(input: ChatbotPersonalizedGuidanceInput): Promise<ChatbotPersonalizedGuidanceOutput> {
  return chatbotPersonalizedGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPersonalizedGuidancePrompt',
  input: {schema: ChatbotPersonalizedGuidanceInputSchema},
  output: {schema: ChatbotPersonalizedGuidanceOutputSchema},
  prompt: `You are a wellness chatbot that provides personalized guidance based on user profile information and journal entries.

  Profile Information: {{{profile}}}

  Journal Entries: {{{journalEntries}}}

  Based on the user profile and journal entries, provide personalized wellness guidance and recommendations for the following query:

  Query: {{{query}}}
  `,
});

const chatbotPersonalizedGuidanceFlow = ai.defineFlow(
  {
    name: 'chatbotPersonalizedGuidanceFlow',
    inputSchema: ChatbotPersonalizedGuidanceInputSchema,
    outputSchema: ChatbotPersonalizedGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
