import React, { useState } from "react";

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

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
    if (currentPriority === Priority.HIGH) return '⭐';
    if (currentPriority === Priority.MEDIUM && (p === Priority.LOW || p === Priority.MEDIUM)) return '⭐';
    if (currentPriority === Priority.LOW && p === Priority.LOW) return '⭐';
    return '☆';
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
