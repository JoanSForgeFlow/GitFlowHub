import React, { useState } from "react";
import ProfileButton from "./ProfileButton";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onUserSearchChange: (user: string) => void;
  onRepoSearchChange: (repo: string) => void;
  onTitleSearchChange: (title: string) => void;
  username: string;
  avatar_url: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onUserSearchChange,
  onRepoSearchChange,
  onTitleSearchChange,
  username,
  avatar_url,
}) => {
  const [searchUser, setSearchUser] = useState("");
  const [searchRepo, setSearchRepo] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/my-board");
  };

  return (
    <div className="flex justify-end">
      <div className="search-bar">
        <input
          className="input-field"
          type="text"
          placeholder="Search by user"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
            onUserSearchChange(e.target.value);
          }}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Search by repository"
          value={searchRepo}
          onChange={(e) => {
            setSearchRepo(e.target.value);
            onRepoSearchChange(e.target.value);
          }}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Search by PR title"
          value={searchTitle}
          onChange={(e) => {
            setSearchTitle(e.target.value);
            onTitleSearchChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
