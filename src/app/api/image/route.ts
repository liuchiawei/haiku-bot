import { openai } from "@ai-sdk/openai";
import { experimental_generateImage } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { image } = await experimental_generateImage({
    model: openai.image("dall-e-3"),
    prompt: prompt,
    size: "1024x1024",
  });

  return Response.json({
    base64: image.base64,
    uint8Array: image.uint8Array,
    mediaType: image.mediaType,
  });
}
