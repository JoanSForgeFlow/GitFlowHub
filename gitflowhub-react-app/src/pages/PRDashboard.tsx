import React, { useState, useEffect } from "react";
import "../css/PRDashboard.css";
import SearchBar from "../components/SearchBar";
import Repo from "../components/Repo";
import axios from "axios";
import useAuth from "../hooks/useAuth";

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
}

const PRDashboard: React.FC = () => {
  const [pulls, setPulls] = useState<Record<number, Pull>>({});
  const [searchUser, setSearchUser] = useState("");
  const [searchRepo, setSearchRepo] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const { fetchPulls } = useAuth();

  useEffect(() => {
    console.log("Running useEffect");
    const getNewPulls = async () => {
      const newPulls=await fetchPulls();
      setPulls(newPulls)

    };

    getNewPulls()
    
  }, []);

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
    setExpandedRepos((prevExpandedRepos) => {
      const newExpandedRepos = new Set(prevExpandedRepos);
      if (newExpandedRepos.has(repoName)) {
        newExpandedRepos.delete(repoName);
      } else {
        newExpandedRepos.add(repoName);
      }
      return newExpandedRepos;
    });
  };

  const filteredPulls = Object.values(pulls).filter(
    (pull) =>
      pull.User.github_user.toLowerCase().includes(searchUser.toLowerCase()) &&
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
      {Object.keys(repoGroups)
        .filter(
          (repoName) =>
            repoName.toLowerCase().includes(searchRepo.toLowerCase()) &&
            repoGroups[repoName].some(
              (pull) =>
                pull.User.github_user
                  .toLowerCase()
                  .includes(searchUser.toLowerCase()) &&
                pull.title.toLowerCase().includes(searchTitle.toLowerCase())
            )
        )
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        .map((repoName) => (
          <Repo
            key={repoName}
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
