import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.pullRequest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const company1 = await prisma.company.create({
    data: {
      name: "Forgeflow",
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: "usuario1@forgeflow.com",
      password: "contraseñasegura1",
      github_user: "JoanSForgeFlow",
      login: "JoanSForgeFlow",
      company_id: company1.id,
      username: "Joan",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "usuario2@forgeflow.com",
      password: "contraseñasegura2",
      github_user: "alejandroac6",
      login: "alejandroac6",
      company_id: company1.id,
      username: "Alex",
    },
  })

  const user3 = await prisma.user.create({
    data: {
        email: "usuario3@forgeflow.com",
        password: "contraseñasegura3",
        github_user: "pauek",
        login: "pauek",
        company_id: company1.id,
        username: "Pau",
    },
  })

  const user4 = await prisma.user.create({
    data: {
        email: "usuario4@forgeflow.com",
        password: "contraseñasegura4",
        github_user: "LoisRForgeFLow",
        login: "LoisRForgeFLow",
        company_id: company1.id,
        username: "Lois",
    },
  })

  const user5 = await prisma.user.create({
    data: {
        email: "usuario5@forgeflow.com",
        password: "contraseñasegura5",
        github_user: "JordiMForgeFlow",
        login: "JordiMForgeFlow",
        company_id: company1.id,
        username: "Masvi",
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
