import { NextRequest, NextResponse } from "next/server";
import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

export async function POST(request: NextRequest) {

  const { messages } = await request.json()

  const result = streamText({
    model: openai('gpt-4o'),
    tools: {
      profileAndUrls: tool({
        description: 'Essa ferramenta serve para buscar dados do perfil de um usuário do Github ou acessar URLs da API para outras informações de um usuário, como lista de organizações, repositórios, eventos, segiodpres, etc.',
        parameters: z.object({
          username: z.string().describe('Username do usuário no github'),
        }),
        execute: async ({ username }) => {
          const response = await fetch(`https://api.github.com/users/${username}`)
          const data = await response.json()
          return JSON.stringify(data)
        }

      }),

      organizations: tool({
        description: 'Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar sua resposta',
        parameters: z.object({
          url: z.string().url().describe('URL a ser requisitada')
        }),
        execute: async ({ url }) => {
          const response = await fetch(url)
          const data = await response.text()
          return data
        }
      })

    },
    messages,
    maxSteps: 5,
    system: `
      Sempre responda em markdown, sem aspas no início ou fim da mensagem.
    `,
    onStepFinish({ toolResults }) {
      console.log(toolResults);

    }
  })

  return result.toDataStreamResponse()

}