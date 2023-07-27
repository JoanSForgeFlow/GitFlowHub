import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import cron from 'node-cron';

const prisma = new PrismaClient();

const updatePullRequests = cron.schedule('0 * * * *', async () => {
  console.log('Running the update PRs cron job');

  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany();

    // Iterate over all users and update their PRs
    for (let user of users) {
      console.log('Updating PRs for user:', user.github_user);

      let page = 1;
      let prsFromGithub = [];

      while (true) {
        const url = `https://api.github.com/search/issues?q=author:${user.github_user}+is:pr+is:open&per_page=100&page=${page}`;

        const { data: { items: prs } } = await axios.get(url);

        if (prs.length === 0) {
          break;
        }

        prsFromGithub = [...prsFromGithub, ...prs];
        page++;
      }

      // Get all PRs of this user from the database
      const prsFromDb = await prisma.pullRequest.findMany({
        where: {
          user_id: user.id
        },
      });

      // Find the PRs that are in the DB but not on Github
      const prsToBeDeleted = prsFromDb.filter(prFromDb => !prsFromGithub.some(prFromGithub => prFromGithub.html_url === prFromDb.html_url));

      // Delete these PRs
      for (let prToBeDeleted of prsToBeDeleted) {
        await prisma.pullRequest.delete({
          where: {
            id: prToBeDeleted.id
          }
        });
      }

      // Iterate over all PRs from Github and upsert (create or update) them in the database
      for (let prFromGithub of prsFromGithub) {
        const repoName = prFromGithub.repository_url.split('/').pop();

        // Find if PR already exists in DB
        const existingPr = await prisma.pullRequest.findUnique({
          where: {
            html_url: prFromGithub.html_url,
          },
        });

        if (existingPr) {
          // Check if state or title has changed before updating
          if (existingPr.state !== prFromGithub.state || existingPr.title !== prFromGithub.title) {
            await prisma.pullRequest.update({
              where: {
                html_url: prFromGithub.html_url,
              },
              data: {
                number: prFromGithub.number,
                title: prFromGithub.title,
                state: prFromGithub.state,
                repo_name: repoName,
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
    console.error('Error updating PRs:', error.message);
  }
});

export default updatePullRequests;
