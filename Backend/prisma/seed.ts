import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const company1 = await prisma.company.create({
    data: {
      name: "Forgeflow",
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: "usuario1@forgeflow.com",
      password: "contraseñasegura1",
      github_user: "usuario1",
      login: "usuario1login",
      company_id: company1.id,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "usuario2@forgeflow.com",
      password: "contraseñasegura2",
      github_user: "usuario2",
      login: "usuario2login",
      company_id: company1.id,
    },
  })

  const pr1 = await prisma.pullRequest.create({
    data: {
      number: 1,
      title: "Commit Inicial",
      description: "Commit inicial para el proyecto",
      state: "abierto",
      html_url: "https://github.com/usuario1/repositorio/pull/1",
      repo_name: "repositorio",
      user_id: user1.id,
    },
  })

  const pr2 = await prisma.pullRequest.create({
    data: {
      number: 2,
      title: "Segundo Commit",
      description: "Segundo commit para el proyecto",
      state: "cerrado",
      html_url: "https://github.com/usuario2/repositorio/pull/2",
      repo_name: "repositorio",
      user_id: user2.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
