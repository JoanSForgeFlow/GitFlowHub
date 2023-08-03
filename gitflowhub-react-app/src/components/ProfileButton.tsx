import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProfileButton.css";

interface ProfileButtonProps {
  username: string;
  avatar_url: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ username, avatar_url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/my-profile");
  };

  return (
    <div className="profile-button" onClick={handleClick}>
      <img src={avatar_url} alt={`${username}'s avatar`} />
      <span>My Profile</span>
    </div>
  );
};

export default ProfileButton;

