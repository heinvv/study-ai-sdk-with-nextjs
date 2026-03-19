import { UIMessage, streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
        try {
                const { messages }: { messages: UIMessage[] } = await req.json();

                const result = streamText({
                        model: openai("gpt-4.1-nano"),
                        messages: await convertToModelMessages(messages),
                });

                result.usage.then((usage) => {
                        console.log({
                                messageCount: messages.length,
                                inputTokens: usage.inputTokens,
                                outputTokens: usage.outputTokens,
                                totalTokens: usage.totalTokens,
                        });
                });

                return result.toUIMessageStreamResponse();
        } catch (error) {
                console.error("Error streaming text: ", error);
                return new Response( "Failed to fetch stream", { status: 500 });
        }
}
