"use client";

type Props = {
  onSearch: (value: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск товаров..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
