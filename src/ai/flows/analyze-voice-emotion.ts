'use server';
/**
 * @fileOverview An AI agent that analyzes audio input to detect emotional states and provide wellness insights.
 *
 * - analyzeVoiceEmotion - A function that handles the emotional analysis of voice recordings.
 * - AnalyzeVoiceEmotionInput - The input type for the analyzeVoiceEmotion function.
 * - AnalyzeVoiceEmotionOutput - The return type for the analyzeVoiceEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVoiceEmotionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the user's voice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeVoiceEmotionInput = z.infer<typeof AnalyzeVoiceEmotionInputSchema>;

const AnalyzeVoiceEmotionOutputSchema = z.object({
  detectedEmotion: z.string().describe('The primary emotion detected in the voice recording.'),
  intensity: z.number().min(1).max(10).describe('The emotional intensity detected on a scale of 1-10.'),
  insight: z.string().describe('A psychological insight or observation based on the emotional subtext (pacing, tone, pauses).'),
  suggestedAction: z.string().describe('A recommended Salus reflection module (e.g., CBT, Stoic, Ikigai, Identity).'),
  summary: z.string().describe('A brief summary of what the user said.'),
});
export type AnalyzeVoiceEmotionOutput = z.infer<typeof AnalyzeVoiceEmotionOutputSchema>;

export async function analyzeVoiceEmotion(input: AnalyzeVoiceEmotionInput): Promise<AnalyzeVoiceEmotionOutput> {
  return analyzeVoiceEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVoiceEmotionPrompt',
  input: {schema: AnalyzeVoiceEmotionInputSchema},
  output: {schema: AnalyzeVoiceEmotionOutputSchema},
  prompt: `You are an expert psychological listener within the Salus Mental Wellness Sanctuary. 
  
  You will analyze the provided audio recording of a user reflecting on their state of mind.
  
  Your goal is to detect the emotional subtext—not just what they say, but HOW they say it. Pay attention to:
  - Pacing (is it rushed or hesitant?)
  - Tone (is it flat, strained, or bright?)
  - Pauses (where do they stop to think?)

  Provide a supportive, structured analysis that includes the primary emotion, its intensity, a warm insight, a brief summary of their words, and a recommendation for which Salus reflection module would best help them right now.

  Audio: {{media url=audioDataUri}}`,
});

const analyzeVoiceEmotionFlow = ai.defineFlow(
  {
    name: 'analyzeVoiceEmotionFlow',
    inputSchema: AnalyzeVoiceEmotionInputSchema,
    outputSchema: AnalyzeVoiceEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
