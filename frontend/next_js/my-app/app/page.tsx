"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import Products from "@/components/Products";

export default function Page() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  return (
    <> 
      <SearchBar onSearch={setSearch} />
      <Categories active={category} onSelect={setCategory} />
      <Products search={search} category={category} />
    </>
  );
}
