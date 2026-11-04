
import { useEffect, useState } from "react";
import type { Product, ProductsResponse } from "../types";
import ProductGrid from "../components/ProductGrid";

const LIMIT = 12;

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // გვერდების საერთო რაოდენობა
  const totalPages = Math.ceil(total / LIMIT);

  // გვერდების სია, დამოკიდებულია მიმდინარე გვერდზე და საერთო გვერდების რაოდენობაზე
  const getVisiblePages = (): (number | "...")[] => {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1, "...", totalPages - 2, totalPages - 1, totalPages,
      ];
    }

    return [
      1, "...", page - 1, page, page + 1, "...", totalPages,
    ];
  };

  // პროდუქტების ჩამოტვირთვა არჩეული გვერდის მიხედვით
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const skip = (page - 1) * LIMIT;
        const response = await fetch(
          `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Products could not be loaded.");
        }

        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotal(data.total);
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

    void fetchProducts();

    return () => {
      controller.abort();
    };
  }, [page]);

   // გვერდის შეცვლა
  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages || newPage === page) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // საჩვენებელი პროდუქტების ნომრები
  const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-8">
        {/* <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
          10X Shop
        </p> */}

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Product Catalog
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Discover your favorite products and view their details.
        </p>
      </div>

      {loading && (
        <p
          role="status"
          className="py-12 text-center text-gray-600"
        >
          Loading products...
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
            Reload the page
          </button>
        </div>
      )}

      
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="py-12 text-center text-gray-600">
              No products found.
            </p>
          ) : (
            <>
              <p className="mb-5 text-sm text-gray-500">
                {/* Found {products.length} products. */}
                Showing {startItem}-{endItem} of {total} products.
              </p>

              <ProductGrid products={products} />

              <div className="mt-10 flex flex-nowrap items-center justify-center gap-1 sm:gap-2">

                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="shrink-0 rounded-lg border border-gray-300 px-2 py-0.5 sm:py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden text-lg">‹</span>
                </button>

                {/* <span className="text-sm font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span> */}

                {getVisiblePages().map((pageNumber, index) => {
                  if (pageNumber === "...") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-1 text-gray-500"
                        aria-hidden="true"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={page === pageNumber ? "page" : undefined}
                      className={`h-8 min-w-8 sm:h-10 sm:min-w-10 rounded-lg border px-1 sm:px-3 text-xs sm:text-sm font-medium transition-colors ${
                        page === pageNumber
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="shrink-0 rounded-lg border border-gray-300 px-2 py-0.5 sm:py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden text-lg">›</span>
                </button>

              </div>

            </>
          )}
        </>
      )}

    </section>
  );
}

export default HomePage;
