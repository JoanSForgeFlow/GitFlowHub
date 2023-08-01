import prisma from "../Middlewares/prisma-client.js";
import axios from "axios";

const getPRsByCompany = async (req, res) => {
  // Get the github user from the request
  const githubUser = req.query.github_user;

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      github_user: githubUser,
    },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }
  // Check if the user's company_id is false
  if (!user.company_id) {
    // If the company_id is false, find all PRs from users with a false company_id
    const prs = await prisma.pullRequest.findMany({
      where: {
        User: {
          company_id: null,
        },
      },
      include: {
        User: true,
      },
    });

    return res.json(prs);
  } else {
    // If the company_id is not false, find all PRs from users with the same company_id
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
  }
};

const getAndUpdateAvatarUrl = async (req, res) => {
  const githubUser = req.params.githubUser;

  const user = await prisma.user.findUnique({
    where: { github_user: githubUser },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  if (!user.avatar_url) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${githubUser}`
      );
      const avatarUrl = response.data.avatar_url;
      await prisma.user.update({
        where: { github_user: githubUser },
        data: { avatar_url: avatarUrl },
      });
      return res.status(200).send("Avatar URL updated successfully");
    } catch (error) {
      return res.status(500).send("Failed to update Avatar URL");
    }
  } else {
    return res.status(200).send("Avatar URL already exists");
  }
};

const getCompanyUsers = async (req, res) => {
  const { user } = req;
  const { company_id } = req;

  try {
    const usersInCompany = await prisma.user.findMany({
      where: {
        company_id,
      },
    });

    const list_users = usersInCompany.map((user) => ({
      username: user.username,
      user_id: user.id,
    }));

    return res.status(200).json(list_users);
  } catch (error) {
    return res.status(500).send("Failed to find users");
  }
};

export { getPRsByCompany, getAndUpdateAvatarUrl, getCompanyUsers };
