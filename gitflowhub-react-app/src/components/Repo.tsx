import React, { useState } from 'react';
import PR from './PR';

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
            pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
            pull.title.toLowerCase().includes(searchTitle.toLowerCase())
          ).map((pull: Pull) => (
            <PR pull={pull} />
          ))}
        </div>
      )}
    </div>
  );
  
  export default Repo;
