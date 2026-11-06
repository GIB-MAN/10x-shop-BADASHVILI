
import { useEffect, useState } from "react";
import type { Product } from "../types";
import ProductGrid from "./ProductGrid";

type RelatedProductsProps = {
  category: string;
  currentProductId: number;
};

function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
    useEffect(() => {
      if (!category) {
        return;
      }

      const controller = new AbortController();

      async function fetchRelatedProducts() {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            `https://dummyjson.com/products/category/${encodeURIComponent(category)}`,
            { signal: controller.signal },
          );

          if (!response.ok) {
            throw new Error("Failed to load similar products.");
          }

          const data: { products: Product[] } = await response.json();

          setProducts(
            data.products.filter(
              (product) => product.id !== currentProductId,
            ),
          );
        } catch (err: unknown) {
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }

          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred.",
          );
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      }

      void fetchRelatedProducts();

      return () => {
        controller.abort();
      };
    }, [category, currentProductId]);

  if (loading) {
    return (
      <section className="mt-12" aria-busy="true">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Similar Products
        </h2>
        <p role="status" className="text-gray-600">
          Loading similar products...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Similar Products
        </h2>
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Similar Products
      </h2>

      <ProductGrid products={products} />
    </section>
  );
}

export default RelatedProducts;
