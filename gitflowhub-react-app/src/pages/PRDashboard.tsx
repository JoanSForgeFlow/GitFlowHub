import React, { useState, useEffect } from 'react';
import '../css/PRDashboard.css';
import SearchBar from '../components/SearchBar';
import Repo from '../components/Repo';
import axios from 'axios';


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
    console.log('fetchPulls is running');
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/prs?github_user=JoanSForgeFlow`;
  
      const { data: prs } = await axios.get(url);
      
      // Registro de seguimiento
      console.log('Data received from API:', prs);
  
      if (prs && prs.length > 0) {
        for (let pull of prs) {
          const repoName = pull.repository_url.split('/').slice(-2).join('/');
          setPulls(prevPulls => {
            // Registro de seguimiento
            const newPulls = {...prevPulls, [pull.id]: {...pull, repo_name: repoName}};
            console.log('Updated pulls:', newPulls);
            return newPulls;
          });
        }
      }
  
    } catch (error: any) {
      console.error('Error:', error.message);
      console.error('Error response:', error.response);
    }
  }  
  

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

  const repoGroups = groupByRepository(pulls);

  const autoExpand = filteredPulls.length <= 5;

  return (
    <div className="github-app">
      <SearchBar
        onUserSearchChange={(user) => setSearchUser(user)}
        onRepoSearchChange={(repo) => setSearchRepo(repo)}
        onTitleSearchChange={(title) => setSearchTitle(title)}
      />
      {Object.keys(repoGroups).filter(repoName =>
        repoName.toLowerCase().includes(searchRepo.toLowerCase()) &&
        repoGroups[repoName].some(pull => 
          pull.user.login.toLowerCase().includes(searchUser.toLowerCase()) &&
          pull.title.toLowerCase().includes(searchTitle.toLowerCase())
        )
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).map((repoName) => (
        <Repo 
        repoName={repoName} 
        pulls={repoGroups[repoName]} 
        handleRepoClick={handleRepoClick} 
        searchUser={searchUser}
        searchTitle={searchTitle}
        autoExpand={autoExpand}
        isExpanded={expandedRepos.has(repoName)}
        />
      ))}
    </div>
  );
};

export default PRDashboard;
