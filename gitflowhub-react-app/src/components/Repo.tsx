import React, { useState } from "react";
import PR from "./PR";
import useAuth from "../hooks/useAuth";
import Tooltip from "@mui/material/Tooltip";
import { Pull, Priority } from "../interfaces/types";

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

  const sortedPulls = [...filteredPulls].sort((a, b) => {
    if (a.priority === b.priority) return 0;
    if (a.priority === Priority.HIGH) return -1;
    if (b.priority === Priority.HIGH) return 1;
    if (a.priority === Priority.MEDIUM) return -1;
    return 1;
  });

  const assigned_PR = filteredPulls.filter(
    (pull) => pull.asigned_user?.username === auth.username
  ).length;
  const owner_PR = filteredPulls.filter(
    (pull) => pull.User.username === auth.username
  ).length;
  return (
    <div key={repoName} className="repo-group">
      <h2 onClick={() => handleRepoClick(repoName)} className="repo-title">
      {!autoExpand && (
          <i
            className={`fa ${
              isExpanded ? "fa-chevron-down" : "fa-chevron-right"
            }`}
            style={{ marginRight: "5px" }}
          ></i>
        )}

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
          {sortedPulls.map((pull: Pull) => (
            <PR key={pull.id} pull={pull} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repo;
