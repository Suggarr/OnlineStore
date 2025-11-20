"use client";

import { Search, X } from "lucide-react";
import styles from "./SearchBar.module.css";

type Props = {
  onSearch: (value: string) => void;
  value?: string;
};

export default function SearchBar({ onSearch, value = "" }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Искать товары, категории..."
          value={value}
          onChange={handleChange}
          className={styles.searchInput}
          aria-label="Поиск товаров"
        />
        {value && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Очистить поиск"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
