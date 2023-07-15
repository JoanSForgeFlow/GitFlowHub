import React, { useState, useEffect } from 'react';
import GoIcon from '../components/GoIcon';
import '../css/PRDashboard.css';

interface User {
  login: string;
  avatar_url: string;
}

interface Pull {
  id: number;
  title: string;
  user: User;
  html_url: string;
  state: string;
  created_at: string;
  repo_name: string;
}

const PRDashboard: React.FC = () => {
  const [pulls, setPulls] = useState<Record<number, Pull>>({});
  const [searchUser, setSearchUser] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPulls();
  }, []);

  const fetchPulls = async () => {
    const users = ['JoanSForgeFlow', 'alejandroac6', 'pauek'];

    for (let username of users) {
      try {
        const url = `https://api.github.com/search/issues?q=author:${username}+is:pr+is:open`;

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          for (let pull of data.items) {
            const repoName = pull.repository_url.split('/').slice(-1)[0];
            setPulls(prevPulls => ({...prevPulls, [pull.id]: {...pull, repo_name: repoName}}));
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const groupByRepository = (pulls: Record<number, Pull>) => {
    const groups: Record<string, Pull[]> = {};
    Object.values(pulls).forEach((pull) => {
      if (!groups[pull.repo_name]) {
        groups[pull.repo_name] = [];
      }
      groups[pull.repo_name].push(pull);
    });
    return groups;
  };

  const repoGroups = groupByRepository(pulls);

  const handleRepoClick = (repoName: string) => {
    setExpandedRepos(prevExpandedRepos => {
      const newExpandedRepos = new Set(prevExpandedRepos);
      if (newExpandedRepos.has(repoName)) {
        newExpandedRepos.delete(repoName);
      } else {
        newExpandedRepos.add(repoName);
      }
      return newExpandedRepos;
    });
  };

  const filteredPulls = Object.values(pulls).filter(pull =>
    pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
    pull.repo_name.toLowerCase().includes(searchRepo.toLowerCase()) &&
    pull.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const autoExpand = filteredPulls.length <= 5;

  return (
    <div className="github-app">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by repository"
          value={searchRepo}
          onChange={(e) => setSearchRepo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by PR title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>
      {Object.keys(repoGroups).filter(repoName =>
        repoName.toLowerCase().includes(searchRepo.toLowerCase()) &&
        repoGroups[repoName].some(pull => 
          pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
          pull.title.toLowerCase().includes(searchTitle.toLowerCase())
        )
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).map((repoName) => (
        <div key={repoName} className="repo-group">
          <h2 onClick={() => handleRepoClick(repoName)}>{repoName}</h2>
          {(autoExpand || expandedRepos.has(repoName)) && (
            <div className="pull-cards"> 
              {repoGroups[repoName].filter(pull => 
                pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
                pull.title.toLowerCase().includes(searchTitle.toLowerCase())
              ).map((pull: Pull) => (
                <div key={pull.id} className="card">
                  <div className="card-header">
                    <img src={pull.user.avatar_url} alt="User avatar" className="user-info__img" />
                    <h3>{pull.title}</h3>
                    <GoIcon url={pull.html_url} />
                  </div>
                  <div className="card-body">
                    <p>Submitted by: {pull.user.login}</p>
                    <p>State: {pull.state}</p>
                    <p>Created at: {pull.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PRDashboard;