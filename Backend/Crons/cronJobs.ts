import { PrismaClient } from "@prisma/client";
import axios from "axios";
import cron from "node-cron";

const prisma = new PrismaClient();

export const updateUserPullRequests = async () => {
  console.log("Running the update PRs cron job");

  try {
    // Retrieve all users from the database, ordered by id in descending order
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    // Iterate over all users and update their PRs
    for (let user of users) {
      console.log("Updating PRs for user:", user.github_user);

      let page = 1;
      let prsFromGithub = [];

      while (true) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const url = `https://api.github.com/search/issues?q=author:${user.github_user}+is:pr+is:open&per_page=100&page=${page}`;
        console.log("API has been called once")

        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        });

        const prs = response.data.items;

        prsFromGithub = [...prsFromGithub, ...prs];
        // Examinar el encabezado "Link" para determinar si hay una siguiente página
        const linkHeader = response.headers.link || "";
        const hasNextPage = linkHeader.includes('rel="next"');
        if (!hasNextPage || prs.length === 0) {
          break;
        }

        page++;
      }


      // Get all PRs of this user from the database
      const prsFromDb = await prisma.pullRequest.findMany({
        where: {
          user_id: user.id,
        },
      });

      // Find the PRs that are in the DB but not on Github
      const prsToBeDeleted = prsFromDb.filter(
        (prFromDb) =>
          !prsFromGithub.some(
            (prFromGithub) => prFromGithub.html_url === prFromDb.html_url
          )
      );

      // Delete these PRs
      for (let prToBeDeleted of prsToBeDeleted) {
        await prisma.pullRequest.delete({
          where: {
            id: prToBeDeleted.id,
          },
        });
      }

      // Iterate over all PRs from Github and upsert (create or update) them in the database
      for (let prFromGithub of prsFromGithub) {
        const parts = prFromGithub.html_url.split('/');
        const githubOrgOrUser = parts[parts.length - 4];
        const repoName = parts[parts.length - 3];

        // Find if PR already exists in DB
        const existingPr = await prisma.pullRequest.findUnique({
          where: {
            html_url: prFromGithub.html_url,
          },
        });

        if (existingPr) {
          // Check if state or title has changed before updating
          if (
            existingPr.state !== prFromGithub.state ||
            existingPr.title !== prFromGithub.title
          ) {
            await prisma.pullRequest.update({
              where: {
                html_url: prFromGithub.html_url,
              },
              data: {
                number: prFromGithub.number,
                title: prFromGithub.title,
                state: prFromGithub.state,
                repo_name: repoName,
                github_org_or_user: githubOrgOrUser
              },
            });
          }
        } else {
          // Create new PR
          await prisma.pullRequest.create({
            data: {
              number: prFromGithub.number,
              title: prFromGithub.title,
              state: prFromGithub.state,
              created_at: new Date(prFromGithub.created_at),
              html_url: prFromGithub.html_url,
              repo_name: repoName,
              github_org_or_user: githubOrgOrUser,
              priority: "LOW",
              User: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error updating PRs:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
};

export const updatePRReviewStatus = async () => {
  console.log("Running the update PR review status cron job");

  try {
    // Retrieve all open PRs from the database
    const openPRs = await prisma.pullRequest.findMany({
      where: {
        state: 'open'  // Only consider open PRs
      }
    });

    for (let pr of openPRs) {
      // Call GitHub API to get PR reviews
      const url = `https://api.github.com/repos/${pr.github_org_or_user}/${pr.repo_name}/pulls/${pr.number}/reviews`;

      const { data: reviews } = await axios.get(url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      });

      const approvedReviewsCount = reviews.filter(review => review.state === "APPROVED").length;

      let review_state = "reviews_welcomed";
      if (approvedReviewsCount >= 2) {
        review_state = "approved";
      }

      // Update PR review status in the database if it has changed
      if (pr.review_status !== review_state) {
        await prisma.pullRequest.update({
          where: {
            id: pr.id,
          },
          data: {
            review_status: review_state,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error updating PRs review status:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
};

const updatePRReviewStatusJob = cron.schedule("0 2 * * *", updatePRReviewStatus);

const updatePullRequests = cron.schedule("*/10 * * * *", updateUserPullRequests);

export default updatePullRequests;
