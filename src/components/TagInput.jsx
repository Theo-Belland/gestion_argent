import { useState } from 'react';
import '../styles/tagInput.scss';

function TagInput({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions] = useState([
    'urgent', 'récurrent', 'vacances', 'travail', 'personnel', 
    'cadeau', 'santé', 'éducation', 'investissement', 'bonus'
  ]);

  const handleAddTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(
    s => s.includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="tag-input-container">
      <div className="tags-display">
        {tags.map((tag, index) => (
          <span key={index} className="tag-badge">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="tag-remove">×</button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Ajouter des tags..." : ""}
          className="tag-input"
        />
      </div>
      
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="tag-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAddTag(suggestion)}
              className="tag-suggestion"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;
