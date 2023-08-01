import React from 'react';
import GoIcon from './GoIcon';
import DragList from './DragList';

interface User {
  id: number;
  email: string;
  username: string | null;
  password: string;
  token: string | null;
  confirmed: boolean;
  location: string | null;
  language: string | null;
  timeZone: string | null;
  image: string | null;
  github_user: string;
  login: string;
  avatar_url: string;
  company_id: number;
}

interface Pull {
  id: number;
  title: string;
  User: User;
  html_url: string;
  state: string;
  created_at: string;
  repo_name: string;
  number: number; 
}

interface PRProps {
  pull: Pull;
}

const PR: React.FC<PRProps> = ({ pull }) => (
  <div key={pull.id} className="card">
    <div className="card-header">
      <img src={pull.User.avatar_url} alt="User avatar" className="user-info__img" />
      <h3>{pull.title}</h3>
      <GoIcon url={pull.html_url} />
    </div>
    <div className="card-body">
      <p>Submitted by: {pull.User.login}</p>
      <p>State: {pull.state}</p>
      <p>Created at: {pull.created_at}</p>
      <p>PR number: {pull.number}</p>
      <DragList/>
    </div>
  </div>
);

export default PR;
