import React, { useState } from "react";
import { Priority } from "../interfaces/types";

interface StarRatingProps {
  className?: string;
  priority: Priority;
  onChange: (newPriority: Priority) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ priority, onChange }) => {
  const [currentPriority, setCurrentPriority] = useState<Priority>(priority);

  const handleStarClick = (newPriority: Priority) => {
    setCurrentPriority(newPriority);
    onChange(newPriority);
  };

  const renderStar = (p: Priority) => {
    if (currentPriority === Priority.HIGH) return <i className="fas fa-star"></i>;
    if (currentPriority === Priority.MEDIUM && (p !== Priority.HIGH)) return <i className="fas fa-star"></i>;
    if (currentPriority === Priority.LOW && p === Priority.LOW) return <i className="fas fa-star"></i>;
    return <i className="far fa-star"></i>;
  };
  
  return (
    <div className="star-rating">
      <span className="star" onClick={() => handleStarClick(Priority.LOW)}>{renderStar(Priority.LOW)}</span>
      <span className="star" onClick={() => handleStarClick(Priority.MEDIUM)}>{renderStar(Priority.MEDIUM)}</span>
      <span className="star" onClick={() => handleStarClick(Priority.HIGH)}>{renderStar(Priority.HIGH)}</span>
    </div>
  );
};

export default StarRating;
