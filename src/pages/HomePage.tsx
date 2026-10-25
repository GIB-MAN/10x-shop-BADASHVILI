
import { useEffect, useState } from "react";
import type { Product, ProductsResponse } from "../types";
import ProductGrid from "../components/ProductGrid";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://dummyjson.com/products",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("პროდუქტების ჩატვირთვა ვერ მოხერხდა.");
        }

        const data: ProductsResponse = await response.json();
        setProducts(data.products);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "დაფიქსირდა უცნობი შეცდომა.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
          10X Shop
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          პროდუქტების კატალოგი
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          აღმოაჩინე სასურველი პროდუქტები და ნახე მათი დეტალები.
        </p>
      </div>

      {loading && (
        <p
          role="status"
          className="py-12 text-center text-gray-600"
        >
          პროდუქტები იტვირთება...
        </p>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            გვერდის თავიდან ჩატვირთვა
          </button>
        </div>
      )}

      
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="py-12 text-center text-gray-600">
              პროდუქტები ვერ მოიძებნა.
            </p>
          ) : (
            <>
              <p className="mb-5 text-sm text-gray-500">
                ნაპოვნია {products.length} პროდუქტი
              </p>

              <ProductGrid products={products} />
            </>
          )}
        </>
      )}

    </section>
  );
}

export default HomePage;
