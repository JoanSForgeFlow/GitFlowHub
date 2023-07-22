import prisma from "../Middlewares/prisma-client.js";

const getPRsByCompany = async (req, res) => {
  // Get the github user from the request
  const githubUser = req.query.github_user;
  
  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      github_user: githubUser,
    },
    include: {
      Company: true,
    }
  });
  
  // Registro de seguimiento
  console.log('User found:', user);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Get all PRs for the company
  const prs = await prisma.pullRequest.findMany({
    where: {
      User: {
        company_id: user.company_id,
      },
    },
    include: {
      User: true,  // include User data in the response
    },
  });

  // Registro de seguimiento
  console.log('PRs found:', prs);

  return res.json(prs);
};

export {
  getPRsByCompany,
};

