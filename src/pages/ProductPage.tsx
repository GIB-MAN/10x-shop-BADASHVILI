
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import RelatedProducts from "../components/RelatedProducts";
import { discountedPrice, formatPrice } from "../utils/price";

function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  // მომხმარებლის მიერ არჩეული thumbnail სურათების სტეიტი
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // მომხმარებლის მიერ არჩეული პროდუქტის რაოდენობა
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
         navigate("/not-found", { replace: true });
       return;
}

      try {
        setLoading(true);
        setError(null);
        setProduct(null);
        setQuantity(1); //როცა პროდუქციაზე გადავალ არჩეულის რაოდენ დაბრუნდეს 1, 
        setCartMessage(null);

        const response = await fetch(
          `https://dummyjson.com/products/${id}`,
          { signal: controller.signal },
        );

        if (response.status === 404) {
          navigate("/not-found", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load product.");
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
            : "An unknown error occurred.",
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
        const result = addToCart(product, quantity);
        if (result) {
          setCartMessage(result);
        } else {
        setCartMessage(`${quantity} item(s) added to cart successfully.`);
        }
       // addToCart(product, quantity);  // კალათში დავამატოთ არჩეული პროდუქცია რაოდენობით 
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
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        ← Back to Catalog
      </button>

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
                  aria-label={`Picture ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  className={`rounded-lg border-2 p-1 transition-colors ${
                    selectedImage === image
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} — Picture ${index + 1}`}
                    className="h-16 w-16 object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* /////  thumbnail სურატების ჩასმა თუ ისინი არსებობს. end*/}
        </div>


<div className="flex flex-col">
  {/* Product title */}
  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
    {product.title}
  </h1>

  {/* Brand and Category */}
  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
    {product.brand && (
      <span className="font-medium text-gray-600">
        {product.brand}
      </span>
    )}

    {product.brand && (
      <span className="text-gray-300">•</span>
    )}

    <Link
      to={`/?category=${encodeURIComponent(product.category)}`}
      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
    >
      {product.category}
    </Link>
  </div>

  {/* Price and Add to Cart */}
  <div className="mt-6 flex flex-wrap items-center gap-3">
    <span className="text-3xl font-bold text-blue-600">
        {formatPrice(
          discountedPrice(product.price, product.discountPercentage)
        )}
      </span>

      <span className="text-lg text-gray-400 line-through">
        {formatPrice(product.price)}
      </span>

      <span className="rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
        -{product.discountPercentage.toFixed(0)}%
      </span>

    
  </div>

  {/* Rating */}
        <div className="mt-4 flex items-center gap-2">

          <span className="text-lg text-yellow-400">★</span>

          <span className="text-sm font-semibold text-gray-700">
            {product.rating.toFixed(1)}
          </span>

          <span className="text-sm text-gray-400">  / 5 </span>

          <span className="text-sm text-gray-400"> • </span>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className="text-sm text-blue-600 hover:underline"
          >
            {product.reviews?.length ?? 0} reviews
          </button>

        </div>

          {/* Stock status */}
          <div className="mt-3">
            {product.stock === 0 ? (
              <span className="text-sm font-semibold text-red-600">
                Out of stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-sm font-semibold text-orange-500">
                Only {product.stock} left!
              </span>
            ) : (
              <span className="text-sm font-semibold text-green-600">
                In stock
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Quantity stepper */}
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={product.stock === 0 || quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <span
                aria-live="polite"
                className="min-w-8 text-center text-sm font-semibold"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={product.stock === 0 || quantity >= product.stock}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {product.stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>

            {cartMessage && (
              <p
                role="status"
                className={`mt-2 text-sm font-medium ${
                  cartMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {cartMessage}
              </p>
            )}

          </div>

          {/* Description */}
          <p className="mt-5 leading-7 text-gray-600">
            {product.description}
          </p>

        </div>

      </div>



{/* Product Tabs */}
<div className="mt-12 border-t border-gray-200 pt-6">

  {/* Tab buttons */}
  <div className="flex gap-6 border-b border-gray-200">

    <button
      type="button"
      onClick={() => setActiveTab("description")}
      className={`pb-3 text-sm font-semibold transition-colors ${
        activeTab === "description"
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-800"
      }`}
      aria-selected={activeTab === "description"}
      role="tab"
    >
      Description
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("reviews")}
      className={`pb-3 text-sm font-semibold transition-colors ${
        activeTab === "reviews"
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-800"
      }`}
      aria-selected={activeTab === "reviews"}
      role="tab"
    >
      Reviews ({product.reviews?.length ?? 0})
    </button>

  </div>

  {/* Tab content */}
  <div className="py-6">

    {activeTab === "description" && (
      <div role="tabpanel">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Product Description
        </h2>

        <p className="max-w-3xl leading-7 text-gray-600">
          {product.description}
        </p>
      </div>
    )}

    {activeTab === "reviews" && (
      <div role="tabpanel">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Customer Reviews
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {product.reviews.map((review, index) => (
              <div
                key={`${review.reviewerName}-${index}`}
                className="h-full rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">

                  <p className="font-semibold text-gray-800">
                    {review.reviewerName}
                  </p>

                  <span className="text-sm text-yellow-500">
                    {"★".repeat(review.rating)}
                  </span>

                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {review.comment}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No reviews yet.
          </p>
        )}
      </div>
    )}

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
