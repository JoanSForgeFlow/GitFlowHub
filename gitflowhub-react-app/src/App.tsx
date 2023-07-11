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
}

const App: React.FC = () => {
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    fetchPulls();
  }, []);

  const fetchPulls = async () => {
    try {
      const username = 'JoanSForgeFlow';
      const url = `https://api.github.com/search/issues?q=author:${username}+is:pr+is:open`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setPulls(data.items);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredPulls = pulls.filter(pull =>
    pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
    pull.html_url.toLowerCase().includes(searchRepo.toLowerCase()) &&
    pull.title.toLowerCase().includes(searchTitle.toLowerCase())
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
