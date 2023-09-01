import React from "react";
import GoIcon from "./GoIcon";
import DragList from "./DragList";

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
  avatar_url: string | null;
  company_id: number;
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
  gitflowHubStatus:string;
}

interface PRProps {
  pull: Pull;
}

const PRList: React.FC<PRProps> = ({ pull }) => {
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
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  return (
    <div key={pull.id} className="card-list w-full card-animation">
      <div className="card-header-list">
        <div className="flex">
          {
            pull.User.avatar_url ? 
            (<img
              src={pull.User.avatar_url}
              alt="User avatar"
              className="user-info__img-list"
            />) :
            (<i className="fas fa-user fa-2x" style={{ marginRight: '0.75rem' }}></i>)
          }
          <h3>{pull.title}</h3>
        </div>
  
        <GoIcon url={pull.html_url} />
      </div>
  
      <div className="md:flex md:justify-between md:items-center pt-1 ml-1">
        <p>
          <i className="fas fa-user mr-2 "></i>
          {pull.User.github_user}
        </p>
        <p>
          <i className="fas fa-calendar-alt mr-2 "></i>
          {formatDate(pull.created_at)}
        </p>
        <p>
          <i className="fas fa-hashtag mr-2 "></i>
          {pull.number}
        </p>
        {reviewLabel()}
        <p>
          <span className="font-bold mr-2 ">State:</span>
          {pull.gitflowHubStatus}
        </p>
  
        <div className="lg:w-1/4 ">
          <DragList id_PR={pull.id} />
        </div>
      </div>
    </div>
  );  
};

export default PRList;
