import React from "react";
import GoIcon from "./GoIcon";
import DragList from "./DragList";
import { Draggable } from "react-beautiful-dnd";

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
}

interface PRProps {
  pull: Pull;
  index: number;
}

const PRDraggable: React.FC<PRProps> = ({ pull,index}) => {
  return (
    <Draggable draggableId={pull.id.toString()} index={index}>
      {(provided) => (
        <div key={pull.id} className="card w-full card-animation"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}>
          <div className="card-header">
            <img
              src={pull.User.avatar_url}
              alt="User avatar"
              className="user-info__img"
            />
            <h3>{pull.title}</h3>
            <GoIcon url={pull.html_url} />
          </div>
          <div className="card-body">
            <p>Submitted by: {pull.User.github_user}</p>
            <p>State: {pull.state}</p>
            <p>Created at: {pull.created_at}</p>
            <p>PR number: {pull.number}</p>
            <DragList
              id_PR={pull.id}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default PRDraggable;
