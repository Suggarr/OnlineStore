export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "User" | "Admin" | "SuperAdmin";
  roleValue?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}