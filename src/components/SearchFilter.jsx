import { useState } from 'react';
import '../styles/searchFilter.scss';

function SearchFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const commonTags = ['urgent', 'récurrent', 'vacances', 'travail', 'personnel', 'santé'];

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addTag = (tag) => {
    if (tag && !filters.tags.includes(tag)) {
      const newTags = [...filters.tags, tag];
      const newFilters = { ...filters, tags: newTags };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = filters.tags.filter(t => t !== tagToRemove);
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      tags: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setTagInput('');
  };

  return (
    <div className="search-filter-container">
      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="search-input"
        />
        
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes catégories</option>
          <option value="Alimentation">Alimentation</option>
          <option value="Transport">Transport</option>
          <option value="Logement">Logement</option>
          <option value="Loisirs">Loisirs</option>
          <option value="Santé">Santé</option>
          <option value="Crédit">Crédit</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="filter-row">
        <div className="date-range">
          <label>Du</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="filter-input"
          />
          <label>Au</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="filter-input"
          />
        </div>

      <div className="filter-row">
        <div className="tags-wrapper">
          <span className="tags-label">Tags:</span>
          {filters.tags.map((tag, i) => (
            <span key={i} className="tag-badge">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="tag-badge-remove"
              >×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Ajouter un tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(tagInput.toLowerCase());
              }
            }}
            className="filter-input-small tag-input-wrapper"
          />
        </div>
        <div className="tag-suggestions">
          {commonTags.filter(t => !filters.tags.includes(t)).map((tag, i) => (
            <button
              key={i}
              onClick={() => addTag(tag)}
              className="tag-suggestion-btn"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

        <div className="amount-range">
          <input
            type="number"
            placeholder="Min €"
            value={filters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            className="filter-input-small"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max €"
            value={filters.maxAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            className="filter-input-small"
          />
        </div>

        <button onClick={resetFilters} className="reset-btn">
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
