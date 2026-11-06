
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product, ProductsResponse } from "../types";
import ProductGrid from "../components/ProductGrid";

const LIMIT = 12;

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const [total, setTotal] = useState(0);

  // კატეგორიების ჩამოტვირთვა
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/category-list",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Categories could not be loaded.");
        }

        const data: string[] = await response.json();

        setCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Category loading error:", err);
      }
    }

    void fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  // კატეგორიების ჩამონათვალი
  const [categories, setCategories] = useState<string[]>([]);

  // არჩეული კატეგორია URL-იდან
  const category = searchParams.get("category") ?? "";

  // არჩეული სორტირება URL-იდან
  const sort = searchParams.get("sort") ?? "default";

  // Search input-ის მდგომარეობა
  const [searchInput, setSearchInput] = useState(
    searchParams.get("q") ?? ""
  );

  // Debounce-ის შემდეგ მიღებული საძიებო ტექსტი
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("q") ?? ""
  );

  // URL-იდან მიღებული საძიებო ტექსტი
  const query = searchParams.get("q")?.trim() ?? "";

  // გვერდების საერთო რაოდენობა
  const totalPages = Math.ceil(total / LIMIT);

  // Search-ის Debounce — 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  // Debounce-ის შემდეგ Search-ის URL-ში განახლება
  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();

    const currentQuery = searchParams.get("q") ?? "";

    // თუ საძიებო ტექსტი არ შეცვლილა, არაფერი გავაკეთოთ
    if (trimmedSearch === currentQuery) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    // ძებნისას კატეგორია იშლება
    nextParams.delete("category");

    // ძებნისას პირველი გვერდიდან ვიწყებთ
    nextParams.set("page", "1");

    if (trimmedSearch) {
      nextParams.set("q", trimmedSearch);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams, { replace: true });

  }, [debouncedSearch, searchParams, setSearchParams]);

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

        // let url: string;

        // API endpoint-ის განსაზღვრა
        let endpoint: string;

        if (query) {
          endpoint = "https://dummyjson.com/products/search";
        } else if (category) {
          endpoint = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
        } else {
          endpoint = "https://dummyjson.com/products";
        }

        // API პარამეტრები
        const params = new URLSearchParams({
          limit: String(LIMIT),
          skip: String(skip),
        });

        // Search პარამეტრი
        if (query) {
          params.set("q", query);
        }

        // Sorting პარამეტრები
        if (sort !== "default") {
          const sortOptions: Record<string, { sortBy: string; order: string }> = {
            "price-asc": { sortBy: "price", order: "asc" },
            "price-desc": { sortBy: "price", order: "desc" },
            "rating-desc": { sortBy: "rating", order: "desc" },
            "name-asc": { sortBy: "title", order: "asc" },
          };

          const selectedSort = sortOptions[sort];

          if (selectedSort) {
            params.set("sortBy", selectedSort.sortBy);
            params.set("order", selectedSort.order);
          }
        }

        // საბოლოო URL
        const url = `${endpoint}?${params.toString()}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

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
  }, [page, query, category, sort]);

   // გვერდის შეცვლა
  function handlePageChange(newPage: number) {
  if (newPage < 1 || newPage > totalPages || newPage === page) {
    return;
  }

  const nextParams = new URLSearchParams(searchParams);

  nextParams.set("page", String(newPage));

  setSearchParams(nextParams);

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

        {/* Search Toolbar */}
        <div className="mt-6 max-w-xl">
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search products
          </label>

          <input
            id="product-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by product name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Category Filter */}
        <div className="mt-4 max-w-xl">
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filter by category
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(e) => {
              const nextParams = new URLSearchParams(searchParams);

              const selectedCategory = e.target.value;

              // Search პარამეტრის წაშლა
              nextParams.delete("q");

              // გვერდის დაბრუნება პირველ გვერდზე
              nextParams.set("page", "1");

              if (selectedCategory) {
                nextParams.set("category", selectedCategory);
              } else {
                nextParams.delete("category");
              }

              // Search ველის გასუფთავება
              setSearchInput("");
              setDebouncedSearch("");

              // URL-ის განახლება
              setSearchParams(nextParams);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>


        {/* Sort Filter */}
        <div className="mt-4 max-w-xl">
          <label
            htmlFor="sort-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>

          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => {
              const nextParams = new URLSearchParams(searchParams);

              const selectedSort = e.target.value;

              nextParams.set("page", "1");

              if (selectedSort === "default") {
                nextParams.delete("sort");
              } else {
                nextParams.set("sort", selectedSort);
              }

              setSearchParams(nextParams);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating-desc">Rating: high to low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>


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
