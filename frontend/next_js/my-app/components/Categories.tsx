"use client";

type Props = {
  active: string | null;
  onSelect: (category: string | null) => void;
};

const categories = ["Смартфоны", "Ноутбуки", "Телевизоры", "Наушники", "Бытовая техника"];

export default function Categories({ active, onSelect }: Props) {
  return (
    <div className="categories">
      {categories.map((c) => (
        <button
          key={c}
          className={active === c ? "active" : ""}
          onClick={() => onSelect(active === c ? null : c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
