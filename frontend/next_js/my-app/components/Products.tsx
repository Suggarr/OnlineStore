type Product = {
  id: number;
  title: string;
  price: string;
  category: string;
  img: string;
};

export const products: Product[] = [
  {
    id: 1,
    title: "iPhone 14 Pro",
    price: "120 000 $",
    category: "Смартфоны",
    img: "https://avatars.mds.yandex.net/i?id=d3fc6c4c6c5b684d95888f371815db9ae797ecfc-5481051-images-thumbs&n=13",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    price: "150 000 $",
    category: "Ноутбуки",
    img: "https://img.5element.by/import/images/ut/goods/good_51bf5b93-3621-11f0-8db4-005056012b6d/noutbuk-apple-macbook-air-13-m4-16gb-256gb-a3240-mw123-temnaya-noch--plusadapter-red-line-bs-01-16a-1_600.jpg",
  },
  {
    id: 3,
    title: "LG OLED TV 55\"",
    price: "90 000 $",
    category: "Телевизоры",
    img: "https://avatars.mds.yandex.net/i?id=2d3694dc469f161f78db82ba5383d1cac9c7f963-5228234-images-thumbs&n=13",
  },
  {
    id: 4,
    title: "Sony WH-1000XM5",
    price: "32 000 $",
    category: "Наушники",
    img: "https://avatars.mds.yandex.net/i?id=368b92ac75612c3a667d65346229ec28_l-10326981-images-thumbs&n=13",
  },
];

type Props = {
  search: string;
  category: string | null;
};

export default function Products({ search, category }: Props) {
  const filtered = products.filter((p) => {
    const matchesCategory = category ? p.category === category : true;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products">
      {filtered.map((p) => (
        <div key={p.id} className="product-card" data-category={p.category}>
          <img src={p.img} alt={p.title} />
          <div className="product-info">
            <h3>{p.title}</h3>
            <p>{p.price}</p>
            <button className="add-to-cart">В корзину</button>
          </div>
        </div>
      ))}
    </div>
  );
}
