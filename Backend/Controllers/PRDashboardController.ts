import prisma from "../Middlewares/prisma-client.js";
import axios from 'axios';

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

  if (!user) {
    return res.status(404).send('User not found');
  }

  const prs = await prisma.pullRequest.findMany({
    where: {
      User: {
        company_id: user.company_id,
      },
    },
    include: {
      User: true, 
    },
  });

  return res.json(prs);
};

const getAndUpdateAvatarUrl = async (req, res) => {
  const githubUser = req.params.githubUser;

  const user = await prisma.user.findUnique({
    where: { github_user: githubUser }
  });

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (!user.avatar_url) {
    try {
      const response = await axios.get(`https://api.github.com/users/${githubUser}`);
      const avatarUrl = response.data.avatar_url;
      await prisma.user.update({
        where: { github_user: githubUser },
        data: { avatar_url: avatarUrl }
      });
      return res.status(200).send('Avatar URL updated successfully');
    } catch (error) {
      return res.status(500).send('Failed to update Avatar URL');
    }
  } else {
    return res.status(200).send('Avatar URL already exists');
  }
};

export {
  getPRsByCompany,
  getAndUpdateAvatarUrl,
};

