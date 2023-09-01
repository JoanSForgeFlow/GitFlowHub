import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuggestionList from "./SuggestionList";

interface SearchBarProps {
  onUserSearchChange: (user: string) => void;
  onRepoSearchChange: (repo: string) => void;
  onTitleSearchChange: (title: string) => void;
  username: string;
  avatar_url: string;
  userSuggestions: string[];
  repoSuggestions: string[];
  titleSuggestions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  onUserSearchChange,
  onRepoSearchChange,
  onTitleSearchChange,
  username,
  avatar_url,
  userSuggestions,
  repoSuggestions,
  titleSuggestions,
}) => {
  const [searchUser, setSearchUser] = useState("");
  const [searchRepo, setSearchRepo] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  
  const [filteredUserSuggestions, setFilteredUserSuggestions] = useState<string[]>([]);
  const [filteredRepoSuggestions, setFilteredRepoSuggestions] = useState<string[]>([]);
  const [filteredTitleSuggestions, setFilteredTitleSuggestions] = useState<string[]>([]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/my-board");
  };

  return (
    <div className="flex justify-end">
      <div className="search-bar">
        <div className="input-with-icon">
        <input
            className="input-field"
            type="text"
            placeholder="Search by user"
            value={searchUser}
            onChange={(e) => {
              const inputVal = e.target.value;
              setSearchUser(inputVal);
              const filteredUsers = userSuggestions.filter(user => user.toLowerCase().startsWith(inputVal.toLowerCase()));
              setFilteredUserSuggestions(filteredUsers);
              onUserSearchChange(inputVal);
            }}
          />
          <i className="fas fa-search"></i>
          {searchUser && <SuggestionList items={filteredUserSuggestions} onSuggestionClick={(item) => { setSearchUser(item); onUserSearchChange(item); }} />}
        </div>
        <div className="input-with-icon">
        <input
            className="input-field"
            type="text"
            placeholder="Search by repository"
            value={searchRepo}
            onChange={(e) => {
              const inputVal = e.target.value;
              setSearchRepo(inputVal);
              const filteredRepos = repoSuggestions.filter(repo => repo.toLowerCase().startsWith(inputVal.toLowerCase()));
              setFilteredRepoSuggestions(filteredRepos);
              onRepoSearchChange(inputVal);
            }}
          />
          <i className="fas fa-search"></i>
          {searchRepo && <SuggestionList items={filteredRepoSuggestions} onSuggestionClick={(item) => { setSearchRepo(item); onRepoSearchChange(item); }} />}
        </div>
        <div className="input-with-icon">
        <input
            className="input-field"
            type="text"
            placeholder="Search by PR title"
            value={searchTitle}
            onChange={(e) => {
              const inputVal = e.target.value;
              setSearchTitle(inputVal);
              const filteredTitles = titleSuggestions.filter(title => title.toLowerCase().startsWith(inputVal.toLowerCase()));
              setFilteredTitleSuggestions(filteredTitles);
              onTitleSearchChange(inputVal);
            }}
          />
          <i className="fas fa-search"></i>
          {searchTitle && <SuggestionList items={filteredTitleSuggestions} onSuggestionClick={(item) => { setSearchTitle(item); onTitleSearchChange(item); }} />}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

