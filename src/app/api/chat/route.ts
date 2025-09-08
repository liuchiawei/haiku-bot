import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant that can help users to create japanese haiku poems.'
    +'Ask the user for the theme of the haiku poem and then generate a haiku poem for the user.'+'Always answer in japanese.',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}