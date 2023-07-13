import React, { useState, useEffect } from 'react';
import './App.css';
import GoIcon from './GoIcon';

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

const App: React.FC = () => {
  const [pulls, setPulls] = useState<Record<number, Pull>>({});
  const [searchUser, setSearchUser] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

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
            const repoName = pull.html_url.split('/')[4];
            setPulls(pulls => ({...pulls, [pull.id]: {...pull, repo_name: repoName}}));
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const repos = Array.from(new Set(Object.values(pulls).map(pull => pull.repo_name)));

  const filteredPulls = Object.values(pulls).filter(pull =>
    pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
    pull.repo_name.toLowerCase().includes(searchRepo.toLowerCase()) &&
    pull.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
    (selectedRepo ? pull.repo_name === selectedRepo : true)
  );

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
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
        >
          <option value="">All Repositories</option>
          {repos.map((repo, index) => (
            <option key={index} value={repo}>{repo}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by PR title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>
      <div className="pull-cards">
        {filteredPulls.map((pull: Pull) => (
          <div key={pull.id} className="card">
            <div className="card-header">
              <img src={pull.user.avatar_url} alt="User avatar" className="user-info__img" />
              <h3>{pull.title}</h3>
            </div>
            <div className="card-body">
              <p>Repository: {pull.repo_name}</p>
              <p>Submitted by: {pull.user.login}</p>
              <p>State: {pull.state}</p>
              <p>Created at: {pull.created_at}</p>
              <GoIcon url={pull.html_url} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
