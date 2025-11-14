"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./catalog.css";

type Category = {
    id: string;
    name: string;
    description: string;
    image: string;
};

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    categoryId: string;
};

export default function CatalogPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
    const router = useRouter();

    useEffect(() => {
        async function fetchCategories() {
            const res = await fetch("http://localhost:5200/api/categories");
            const data: Category[] = await res.json();
            setCategories(data);

            const productsData: Record<string, Product[]> = {};
            for (const cat of data) {
                const resP = await fetch(`http://localhost:5200/api/Products/by-categoryId/${cat.id}`);
                if (!resP.ok) {
                    console.error(`Ошибка при получении товаров для категории ${cat.id}:`, resP.status);
                    productsData[cat.id] = [];
                } else {
                    const prods: Product[] = await resP.json();
                    productsData[cat.id] = prods;
                }
            }
            setProductsByCategory(productsData);
        }

        fetchCategories();
    }, []);

    return (
        <div className="catalog">
            <h1>Каталог товаров</h1>

            {categories.map((cat) => (
                <section key={cat.id} className="category-section">
                    <h2>{cat.name}</h2>
                    <div className="products">
                        {productsByCategory[cat.id]?.map((p) => (
                            <div key={p.id} className="product-card" onClick={() => router.push(`/products/${p.id}`)}>
                                <><div className="img-container">
                                    <img src={p.imageUrl} alt={p.name} />
                                    <button className="add-to-cart">В корзину</button>
                                </div><h3>{p.name}</h3><p>{p.price.toLocaleString("ru-RU")} $</p></>
                            </div>
                        ))}
                    </div>
                </section>
            ))
            }

            <style jsx>{`
                .catalog {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: "Segoe UI", sans-serif;
                }

                h1 {
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 40px;
                    color: #2563eb;
                }

                .category-section {
                    margin-bottom: 50px;
                }

                h2 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: #111827;
                }

                .products {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 25px;
                }

                .product-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }

                .product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                }

                .img-container {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f9fafb;
                }

                .img-container img {
                    width: 100%;
                    height: 200px;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                }

                .product-card:hover .img-container img {
                    transform: scale(1.05);
                }

                .add-to-cart {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 8px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                    font-weight: 600;
                }

                .product-card:hover .add-to-cart {
                    opacity: 1;
                }

                h3 {
                    font-size: 16px;
                    margin: 10px 0 5px;
                    text-align: center;
                    color: #111827;
                }

                p {
                    font-weight: bold;
                    color: #2563eb;
                    margin-bottom: 15px;
                    text-align: center;
                }

                @media (max-width: 1024px) {
                    .products {
                        gap: 20px;
                    }
                }

                @media (max-width: 768px) {
                    .products {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 15px;
                    }

                    .img-container img {
                        height: 150px;
                    }

                    .add-to-cart {
                        padding: 6px 12px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div >
    );
}
