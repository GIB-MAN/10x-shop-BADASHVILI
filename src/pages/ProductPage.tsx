
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import RelatedProducts from "../components/RelatedProducts";

function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // მომხმარებლის მიერ არჩეული thumbnail სურათების სტეიტი
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // მომხმარებლის მიერ არჩეული პროდუქტის რაოდენობა
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
        setProduct(null);
        setError("პროდუქტის ID არასწორია.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setProduct(null);
        setQuantity(1); //როცა პროდუქციაზე გადავალ არჩეულის რაოდენ დაბრუნდეს 1, 

        const response = await fetch(
          `https://dummyjson.com/products/${id}`,
          { signal: controller.signal },
        );

        if (response.status === 404) {
          throw new Error("ასეთი პროდუქტი ვერ მოიძებნა.");
        }

        if (!response.ok) {
          throw new Error("პროდუქტის ჩატვირთვა ვერ მოხერხდა.");
        }

        const data: Product = await response.json();
        setProduct(data);
        // თუ პროდუქტი არ გვაქვს რაოდენობა 0 იყოს, ხოლო სხვა პროდუქტზე 1.
        setQuantity(data.stock > 0 ? 1 : 0); 

        // ამოვიღოთ სურათების მასივის პირველი ელემენტი.
        // თუ პირველი სურათი არ არსებობს, ჩავსვათ მთავარი thumbnail.
        setSelectedImage(data.images?.[0] ?? data.thumbnail);

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

    void fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

/////// პროდუქციის რაოდენობის ცვლილების და კალათში დამატების ფუნქციები

      // პროდუქტის რაოდენობის შემცირება
      function decreaseQuantity() {
        setQuantity((current) => Math.max(1, current - 1));
      }

      // პროდუქტის რაოდენობის გაზრდა
      function increaseQuantity() {
        if (!product || product.stock === 0) {
            return;
          }
        setQuantity((current) => Math.min(product!.stock, current + 1));
      }

      // პროდუქტის კალათაში დამატება
      function handleAddToCart() {
        if (!product || product.stock === 0 || quantity < 1) {
          return;
        }

        addToCart(product, quantity);  // კალათში დავამატოთ არჩეული პროდუქცია რაოდენობით 
      }



  if (loading) {
    return (
      <section className="py-16 text-center">
        <p role="status" className="text-gray-600">
          Product is loading...
        </p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="py-12">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6"
        >
          <h1 className="text-xl font-bold text-red-700">
            Product loading issue
          </h1>

          <p className="mt-2 text-red-600">
            {error ?? "Product not found."}
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Catalog
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
      >
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* მთავარი სურათი */}
        <div className="flex flex-col gap-4">
          <div className="flex h-105 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            <img
              src={selectedImage ?? product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          </div>

          {/* /////  thumbnail სურატების ჩასმა თუ ისინი არსებობს. start*/}

          {/* პატარა სურათები */}
          {product.images && product.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`სურათი ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  className={`rounded-lg border-2 p-1 transition-colors ${
                    selectedImage === image
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} — სურათი ${index + 1}`}
                    className="h-16 w-16 object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* /////  thumbnail სურატების ჩასმა თუ ისინი არსებობს. end*/}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-4">

            {product.brand && (
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Brand: {product.brand}
              </span>
            )}

            <div
              className="flex items-center gap-1"
              aria-label={`Rating ${product.rating} out of 5`}
            >
              <span className="text-lg text-yellow-400">★</span>

              <span className="text-sm font-semibold text-gray-700">
                {product.rating.toFixed(1)}
              </span>

              <span className="text-xs text-gray-400">
                / 5
              </span>
            </div>
          </div>

          <p className="mt-5 leading-7 text-gray-600">
            {product.description}
          </p>

          <p className="mt-6 text-3xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-4 text-sm text-gray-600">
            Product ID: {product.id}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            In Stock: {product.stock} units
          </p>


          {/* პროდუქტის რაოდენობის არჩევა. start */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Quantity
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={product.stock === 0 || quantity <= 1}
                aria-label="რაოდენობის შემცირება"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>

              <span
                aria-live="polite"
                className="min-w-8 text-center font-semibold"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={product.stock === 0 || quantity >= product.stock}
                aria-label="Quantity increase"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* კალათაში დამატება */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {product.stock === 0 ? "Out of stock" : "Add to Cart"}
          </button>

           {/* პროდუქტის რაოდენობის არჩევა. end*/}

        </div>
      </div>

      <RelatedProducts
        category={product.category}
        currentProductId={product.id}
      />


    </section>
  );
}

export default ProductPage;
