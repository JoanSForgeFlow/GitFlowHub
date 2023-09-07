import React, { useState } from "react";
import PR from "./PR";
import useAuth from "../hooks/useAuth";
import Tooltip from "@mui/material/Tooltip";

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

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
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
  asigned_user: User;
  review_status: string;
  priority: Priority;
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

const Repo: React.FC<RepoProps> = ({
  repoName,
  pulls,
  handleRepoClick,
  searchUser,
  searchTitle,
  autoExpand,
  isExpanded,
}) => {
  const filteredPulls = pulls.filter(
    (pull) =>
      pull.User.github_user.toLowerCase().includes(searchUser.toLowerCase()) &&
      pull.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
  const { auth } = useAuth();

  const assigned_PR = filteredPulls.filter(
    (pull) => pull.asigned_user?.username === auth.username
  ).length;
  const owner_PR = filteredPulls.filter(
    (pull) => pull.User.username === auth.username
  ).length;
  return (
    <div key={repoName} className="repo-group">
      <h2 onClick={() => handleRepoClick(repoName)} className="repo-title">
        <i
          className={`fa ${
            isExpanded ? "fa-chevron-down" : "fa-chevron-right"
          }`}
          style={{ marginRight: "5px" }}
        ></i>

        <Tooltip title="Pull requests assigned to you">
          <div className="tag text-teal-200">
            <span className="mr-1">{assigned_PR}</span>
            <span className="material-symbols-outlined">person_alert</span>
          </div>
        </Tooltip>

        <Tooltip title="Pull requests that you own">
          <div className="tag">
            <span className="mr-1">{owner_PR}</span>
            <span className="material-symbols-outlined">person</span>
          </div>
        </Tooltip>

        <Tooltip title="Total Pull requests">
          <div className="mr-3 tag text-gray-200">
            <span className="mr-1">{filteredPulls.length}</span>
            <span className="material-symbols-outlined">view_agenda</span>
          </div>
        </Tooltip>

        {repoName}
      </h2>
      {(autoExpand || isExpanded) && (
        <div className="pull-cards">
          {filteredPulls.map((pull: Pull) => (
            <PR key={pull.id} pull={pull} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repo;
