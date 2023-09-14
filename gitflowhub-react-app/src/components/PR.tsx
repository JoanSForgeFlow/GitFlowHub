import React, { useState, useContext } from "react";
import GoIcon from "./GoIcon";
import DragList from "./DragList";
import StarRating from './StarRating';
import AuthContext from "../context/AuthProvider";
import { type } from "os";

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
  avatar_url: string| null;
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
  User: User;
  html_url: string;
  state: string;
  created_at: string;
  repo_name: string;
  number: number;
  asigned_user: User;
  review_status: string;
  priority: Priority;
}

interface PRProps {
  pull: Pull;
}

const PR: React.FC<PRProps> = ({ pull }) => {
  const { changePRPriority, authPulls,setAuthPulls } = useContext(AuthContext);
  const [localPriority, setLocalPriority] = useState<Priority>(pull.priority);
  const reviewLabel = () => {
    switch (pull.review_status) {
      case "approved":
        return <span className="review-label approved">✔ Approved</span>;
      case "reviews_welcomed":
        return <span className="review-label needs-review">⚠ Needs Review</span>;
      default:
        return null;
    }
  };

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  const handleChangePriority = async (newPriority: Priority) => {
    console.log("Changing priority to:", newPriority);
    const updatedPR = await changePRPriority(pull.id, newPriority)
    if (updatedPR) {
      let updatedList={...authPulls}
      updatedList[pull.id].priority=newPriority
      setLocalPriority(newPriority);
      setAuthPulls(updatedList)

    } else {
      alert('Hubo un problema al actualizar la prioridad.');
    }
  };

  return (
    <div key={pull.id} className="card w-full card-animation">
      <div className="card-header">
        {
          pull.User.avatar_url ? 
          (<img
            src={pull.User.avatar_url}
            alt="User avatar"
            className="user-info__img"
          />) :
          (<i className="fas fa-user fa-2x" style={{ marginRight: '0.75rem' }}></i>)
        }
        <h3>{pull.title}</h3>
        <GoIcon url={pull.html_url} />
      </div>
      <div className="card-body">
        <div className="pr-info">
          <i className="fas fa-user"></i>
          <p>{pull.User.github_user}</p>
        </div>
        <div className="pr-info">
          <i className="fas fa-calendar-alt"></i>
          <p>{formatDate(pull.created_at)}</p>
        </div>
        <div className="pr-info">
          <i className="fas fa-hashtag"></i>
          <p>PR #{pull.number}</p>
        </div>
        <StarRating 
        priority={localPriority}
        onChange={handleChangePriority} 
        />
        {reviewLabel()}
        <DragList id_PR={pull.id} />
      </div>
    </div>
  );
};

export default PR;
