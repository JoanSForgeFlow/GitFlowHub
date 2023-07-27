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
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "usuario2@forgeflow.com",
      password: "contraseñasegura2",
      github_user: "alejandroac6",
      login: "alejandroac6",
      company_id: company1.id,
    },
  })

  const user3 = await prisma.user.create({
    data: {
        email: "usuario3@forgeflow.com",
        password: "contraseñasegura3",
        github_user: "pauek",
        login: "pauek",
        company_id: company1.id,
    },
  })

  const user4 = await prisma.user.create({
    data: {
        email: "usuario4@forgeflow.com",
        password: "contraseñasegura4",
        github_user: "LoisRForgeFLow",
        login: "LoisRForgeFLow",
        company_id: company1.id,
    },
  })

  const user5 = await prisma.user.create({
    data: {
        email: "usuario5@forgeflow.com",
        password: "contraseñasegura5",
        github_user: "JordiMForgeFlow",
        login: "JordiMForgeFlow",
        company_id: company1.id,
    },
  })

  const user6 = await prisma.user.create({
    data: {
        email: "usuario6@forgeflow.com",
        password: "contraseñasegura6",
        github_user: "MateuGForgeFlow",
        login: "MateuMForgeFlow",
        company_id: company1.id,
    },
  })

  const user7 = await prisma.user.create({
    data: {
        email: "usuario7@forgeflow.com",
        password: "contraseñasegura7",
        github_user: "mariadforgeflow",
        login: "mariadforgeflow",
        company_id: company1.id,
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
