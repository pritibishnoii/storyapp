import React, { useState } from "react";
import styles from "./filterSection.module.css";
import filters from "../../constants/data";

const FilterSection = (props) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleSelectFilters = (filterName) => {
    setActiveFilter(filterName);
    props.handleSelectFilters(filterName); 
  };

  return (
    <div className={styles.filterContainer}>
      {filters.map((filter, index) => {
        return (
          <div
            key={index}
            onClick={() => handleSelectFilters(filter.name)}
            style={{
              border: activeFilter === filter.name 
                ? "5px solid var(--secondary-color)"
                : "5px solid transparent",
            }}
            className={styles.filterWrapper}
          >
            <div
              style={{
                backgroundImage: `url(${filter.imageUrl})`,
              }}
              className={styles.filterBox}
            ></div>
            <div className={styles.filterName}>{filter.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterSection;
