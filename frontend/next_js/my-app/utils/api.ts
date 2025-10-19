import { ProductDto, CategoryDto } from "./types";

export async function getProducts(): Promise<ProductDto[]> {
  const res = await fetch("http://localhost:5200/api/products");
  return res.json();
}

export async function getCategories(): Promise<CategoryDto[]> {
  const res = await fetch("http://localhost:5000/api/categories");
  return res.json();
}

export async function getProductsByCategory(categoryId: string): Promise<ProductDto[]> {
  const res = await fetch(`http://localhost:5200/api/products/byCategory/${categoryId}`);
  return res.json();
}
