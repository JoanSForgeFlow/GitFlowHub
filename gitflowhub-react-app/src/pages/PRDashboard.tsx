import React, { useState, useEffect, useContext } from "react";
import "../css/PRDashboard.css";
import SearchBar from "../components/SearchBar";
import Repo from "../components/Repo";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import Logo from "../components/Logo";
import { dividerClasses } from "@mui/material";
import Spinner from "../components/Spinner";
import { User, Pull, Priority } from "../interfaces/types";

const PRDashboard: React.FC = () => {

  const [searchUser, setSearchUser] = useState("");
  const [searchRepo, setSearchRepo] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const { fetchPulls, fetchUserInfo, spinner,authPulls,setAuthPulls} = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [repoSuggestions, setRepoSuggestions] = useState<string[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.LOW);


  useEffect(() => {
    console.log("Running useEffect");
  
    const getUserInfoAndPulls = async () => {
      const userData = await fetchUserInfo();
      setUserInfo(userData);
      const newPulls = await fetchPulls();
  
      if (newPulls === null || newPulls === undefined) {
        setAuthPulls([])
        
      } else {
        setAuthPulls(newPulls)
      }
    };
  
    getUserInfoAndPulls();
  }, []);

useEffect(() => {
    console.log("Setting up suggestions based on pulls");

    const uniqueUsers = Array.from(new Set(Object.values(authPulls).map(pull => pull.User.github_user)));
    const uniqueRepos = Array.from(new Set(Object.values(authPulls).map(pull => pull.repo_name)));
    const uniqueTitles = Array.from(new Set(Object.values(authPulls).map(pull => pull.title)));
  
    setUserSuggestions(uniqueUsers);
    setRepoSuggestions(uniqueRepos);
    setTitleSuggestions(uniqueTitles);
}, [authPulls]);

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

  const filteredPulls = Object.values(authPulls).filter(
    (pull) =>
      pull.User.github_user.toLowerCase().includes(searchUser.toLowerCase()) &&
      pull.repo_name.toLowerCase().includes(searchRepo.toLowerCase()) &&
      pull.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      ( 
        (selectedPriority === Priority.LOW) ||
        (selectedPriority === Priority.MEDIUM && pull.priority !== Priority.LOW) ||
        (selectedPriority === Priority.HIGH && pull.priority === Priority.HIGH)
      )
  );  

  const repoGroups = groupByRepository(filteredPulls);

  const autoExpand = filteredPulls.length <= 5;

  return (
    <>
      {!spinner ? (
        <div className="github-app">
          <SearchBar
            username={userInfo?.username ?? ""}
            avatar_url={userInfo?.avatar_url ?? ""}
            onUserSearchChange={(user) => setSearchUser(user)}
            onRepoSearchChange={(repo) => setSearchRepo(repo)}
            onTitleSearchChange={(title) => setSearchTitle(title)}
            userSuggestions={userSuggestions}
            repoSuggestions={repoSuggestions}
            titleSuggestions={titleSuggestions}
            onPriorityChange={(priority) => setSelectedPriority(priority)}
            selectedPriority={selectedPriority}
            filteredPulls={filteredPulls}
          />
          {filteredPulls.length === 0 ? (
            <div className="no-prs-container">
              <Logo />
              <div className="no-prs-message">No PRs matched your search</div>
            </div>
          ) : (
            <div className="w-full bg-gray-300 p-3 border-black rounded-md">
              {Object.keys(repoGroups)
              .filter(
                (repoName) =>
                  repoName.toLowerCase().includes(searchRepo.toLowerCase()) &&
                  repoGroups[repoName].some(
                    (pull) =>
                      pull.User.github_user
                        .toLowerCase()
                        .includes(searchUser.toLowerCase()) &&
                      pull.title
                        .toLowerCase()
                        .includes(searchTitle.toLowerCase())
                  )
              )
              .sort((a, b) =>
                a.localeCompare(b, undefined, { sensitivity: "base" })
              )
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
            
          )}
        </div>
      ) : (
        <div className="flex flex-row align-middle justify-center ml-30">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default PRDashboard;
