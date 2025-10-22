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
