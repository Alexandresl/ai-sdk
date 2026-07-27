import { github } from "@/src/lib/octokit"
import { tool } from "ai"
import z from "zod"

export const githubProfile = tool({
  description: 'Essa ferramenta serve para buscar dados do perfil de um usuário do Github ou acessar URLs da API para outras informações de um usuário, como lista de organizações, repositórios, eventos, segiodpres, etc.',
  parameters: z.object({
    username: z.string().describe('Username do usuário no github'),
  }),
  execute: async ({ username }) => {
    const response = await github.users.getByUsername({ username })
    return response.data
  }

})