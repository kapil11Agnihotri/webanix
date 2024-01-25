"use client"
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const onInputChange = (value) => {
    setSearch(value);
    onSearch(value);
  };
  return (
    <div className="input-container-search d-flex my-2">
      <input
        type="text"
        className="form-control search-input"
        placeholder="Search"
        value={search}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
