import React from "react";

interface SuggestionListProps {
  items: string[];
  onSuggestionClick: (item: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ items, onSuggestionClick }) => {
  return (
    <div className="suggestion-list">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="suggestion-item" 
          onClick={() => onSuggestionClick(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
