import React, { useState } from 'react';
import PR from './PR';

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
  description: string;
  state: string;
  created_at: string;
  html_url: string;
  repo_name: string;
  user_id: number;
  User: User;
  number: number;
  asigned_user:User;
  review_status: string;
}

interface RepoProps {
    repoName: string;
    pulls: Pull[];
    handleRepoClick: (repoName: string) => void;
    searchUser: string;
    searchTitle: string;
    autoExpand: boolean;
    isExpanded: boolean;
  }
  
  const Repo: React.FC<RepoProps> = ({ repoName, pulls, handleRepoClick, searchUser, searchTitle, autoExpand, isExpanded }) => (
    <div key={repoName} className="repo-group">
      <h2 onClick={() => handleRepoClick(repoName)}>{repoName}</h2>
      {(autoExpand || isExpanded) && (
        <div className="pull-cards"> 
          {pulls.filter(pull => 
            pull.User.github_user.toLowerCase().includes(searchUser.toLowerCase()) &&
            pull.title.toLowerCase().includes(searchTitle.toLowerCase())
          ).map((pull: Pull) => (
            <PR key={pull.id} pull={pull} />
          ))}
        </div>
      )}
    </div>
  );
  
  export default Repo;
