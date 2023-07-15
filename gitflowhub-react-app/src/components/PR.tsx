import React from 'react';
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

interface PRProps {
  pull: Pull;
}

const PR: React.FC<PRProps> = ({ pull }) => (
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
);

export default PR;
