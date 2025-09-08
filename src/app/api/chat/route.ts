import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    webSearch,
  }: { messages: UIMessage[]; webSearch: boolean } =
    await req.json();

  const result = streamText({
    model: "openai/gpt-4o",
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant that can help users to create japanese haiku poems." +
      "Ask the user for the theme of the haiku poem and then generate a haiku poem for the user." +
      "Always answer in japanese.",
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        // optional configuration:
        searchContextSize: "high",
      }),
    },
    toolChoice: webSearch ? 'required' : 'none',
  });

  return result.toUIMessageStreamResponse();
}