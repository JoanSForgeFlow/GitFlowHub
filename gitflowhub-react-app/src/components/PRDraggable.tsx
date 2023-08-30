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

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}


const PRDraggable: React.FC<PRProps> = ({ pull,index}) => {
  return (
    <Draggable draggableId={pull.id.toString()} index={index}>
      {(provided,snapshot) => (
        <div key={pull.id} className={`card-draggable w-full card-animation ${snapshot.draggingOver? 'card-dragging':''}`}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}>
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
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <i className="fas fa-user mr-2"></i>
                  <span>{pull.User.github_user}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  <span>{formatDate(pull.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-hashtag mr-2"></i>
                  <span>{pull.number}</span>
                </div>
              </div>
            </div>
            <DragList id_PR={pull.id} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default PRDraggable;
