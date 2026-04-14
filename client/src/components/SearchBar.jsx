import React from 'react';
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search by project name, tech stack, or keyword..." />
      <button>Search</button>
    </div>
  );
}

export default SearchBar;