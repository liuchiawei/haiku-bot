import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage, generateText, experimental_generateImage as generateImage } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant that can help users to create japanese haiku poems.'
    +'Ask the user for the theme of the haiku poem and then use the haiku_generation tool to generate a haiku poem for the user.'
    +'Always answer in japanese.',
    messages: convertToModelMessages(messages),
    tools: {
      haiku_generation: {
        description: 'Generate a haiku poem for a given theme.',
        parameters: z.object({
          theme: z.string(),
        }),
        inputSchema: z.object({
          theme: z.string(),
        }),
        execute: async ({ theme }) => {
          const result = await generateText({
            model: openai('gpt-4o'),
            prompt: `Always respond in japanese. Generate a haiku poem from the theme ${theme}.`,
          });
          return {
            haiku: result.text
          };
        },
      }
    },
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}