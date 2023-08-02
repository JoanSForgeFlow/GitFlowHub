import prisma from "../Middlewares/prisma-client.js";

const getUser = async (req, res) => {
  const { github_user } = req.params;

  const user = await prisma.user.findUnique({
    where: { github_user: github_user },
    select: {
      id: true,
      email: true,
      username: true,
      token: true,
      confirmed: true,
      location: true,
      language: true,
      timeZone: true,
      image: true,
      github_user: true,
      login: true,
      avatar_url: true,
      company_id: true,
      Company: true,
    }
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
};

const getAllCompanies = async (req, res) => {
  const companies = await prisma.company.findMany();

  res.json(companies);
};

const updateUser = async (req, res) => {
  const { github_user } = req.params;
  const { company_id, username } = req.body;

  const user = await prisma.user.findUnique({
    where: { github_user: github_user }
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { github_user: github_user },
    data: { company_id, username },
    select: {
      id: true,
      email: true,
      username: true,
      token: true,
      confirmed: true,
      location: true,
      language: true,
      timeZone: true,
      image: true,
      github_user: true,
      login: true,
      avatar_url: true,
      company_id: true,
      Company: true,
    }
  });

  res.json(updatedUser);
};

export { getUser, getAllCompanies, updateUser };
