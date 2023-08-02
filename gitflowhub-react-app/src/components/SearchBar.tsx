import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onUserSearchChange: (user: string) => void;
  onRepoSearchChange: (repo: string) => void;
  onTitleSearchChange: (title: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onUserSearchChange, onRepoSearchChange, onTitleSearchChange }) => {
  const [searchUser, setSearchUser] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by user"
        value={searchUser}
        onChange={(e) => {
          setSearchUser(e.target.value);
          onUserSearchChange(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Search by repository"
        value={searchRepo}
        onChange={(e) => {
          setSearchRepo(e.target.value);
          onRepoSearchChange(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Search by PR title"
        value={searchTitle}
        onChange={(e) => {
          setSearchTitle(e.target.value);
          onTitleSearchChange(e.target.value);
        }}
      />
      <Link to="/my-profile" className="my-profile-button">My Profile</Link>
    </div>
  );
};

export default SearchBar;
