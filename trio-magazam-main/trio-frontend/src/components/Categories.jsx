import React, { useMemo } from "react";
import Container from "../components/ui/Container";
import { useGetProductsQuery } from "../redux/api/productsApi";

// Tək bir kategoriya elementinin komponenti
const CategoryCard = ({ name, productCount, imageUrl, imageAlt }) => (
  <div 
    className="bg-transparent rounded-xl transition-all duration-300 flex flex-col items-center justify-between p-0 cursor-pointer w-full max-w-[200px] mx-auto group focus:outline-none"
    style={{ minHeight: '200px' }}
  >
    {/* Məhsul Şəkili sahəsi */}
    <div className="w-full aspect-square flex justify-center items-center bg-white">
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="object-contain w-36 h-36 transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=Image+Error"; 
        }}
      />
    </div>

    {/* Məhsul Məlumatı */}
    <div className="text-center mt-2 sm:mt-4 w-full">
      <h3 className="font-bold text-gray-800 line-clamp-2" style={{ fontSize: '19px' }}>
        {name}
      </h3>
      <p className={`text-sm mt-1 ${productCount > 0 ? 'text-gray-600' : 'text-gray-400'}`}>
        {productCount} product{productCount !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

// Əsas Kateqoriya Bölməsi Komponenti
export default function Categories() {
  const { data, isLoading, isError } = useGetProductsQuery();

  const categories = useMemo(() => {
    const products = data?.products || [];

    const categoryMap = products.reduce((acc, product) => {
      const category = product.category;
      if (!category) return acc;

      if (!acc[category]) {
        acc[category] = {
          name: category,
          productCount: 0,
          imageUrl: "",
          imageAlt: `${category} kateqoriyası`
        };
      }

      acc[category].productCount += 1;

      if (!acc[category].imageUrl) {
        const url =
          (product.images && product.images.length > 0 && product.images[0]?.url) ||
          product.image ||
          "";
        if (url) {
          acc[category].imageUrl = url;
        }
      }

      return acc;
    }, {});

    return Object.values(categoryMap).map((cat) => ({
      ...cat,
      imageUrl:
        cat.imageUrl ||
        "https://placehold.co/150x150/6B7280/ffffff?text=No+Image",
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Container>
        <div className="w-full py-8 sm:py-12 flex justify-center items-center">
          <span className="text-gray-600 text-sm sm:text-base">
            Yüklənir...
          </span>
        </div>
      </Container>
    );
  }

  if (isError || !categories.length) {
    return (
      <Container>
        <div className="w-full py-8 sm:py-12 flex justify-center items-center">
          <span className="text-gray-600 text-sm sm:text-base">
            Kateqoriya tapılmadı.
          </span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full py-8 sm:py-12">
        {/* Başlıq */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 tracking-tight text-center sm:text-left">
          Popular Categories
        </h2>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-24px)] xl:w-[calc(16.666%-20px)]"
              style={{ minWidth: '140px', maxWidth: '200px' }}
            >
              <CategoryCard 
                name={category.name} 
                productCount={category.productCount}
                imageUrl={category.imageUrl}
                imageAlt={category.imageAlt}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
