import { NextRequest } from "next/server";
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from "../../../ai/tools";

export async function POST(request: NextRequest) {

  const { messages } = await request.json()

  const result = streamText({
    model: openai('gpt-4o'),
    tools,
    messages,
    maxSteps: 5,
    system: `
      Sempre responda em markdown, sem aspas no início ou fim da mensagem.
    `,
  })

  return result.toDataStreamResponse()

}