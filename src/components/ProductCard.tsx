
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { discountedPrice, formatPrice } from "../utils/price";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product, 1);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`View product: ${product.title}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900">
            {product.title}
          </h2>
          <div className="mt-2 flex items-center justify-between">

            {product.brand && (
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {product.brand}
              </span>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm text-gray-500">
              Category: {product.category}
            </p> 
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(
              discountedPrice(product.price, product.discountPercentage)
            )}
          </span>

          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.price)}
          </span>

          <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
            -{Math.round(product.discountPercentage)}%
          </span>
        </div>

        {product.stock === 0 ? (
            <span className="shrink-0 text-xs font-semibold text-red-600">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="shrink-0 text-xs font-semibold text-orange-500">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="shrink-0 text-xs font-semibold text-green-600">
              In stock
            </span>
          )}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          
          <div
            className="flex items-center gap-1"
            aria-label={`Rating ${product.rating} out of 5`}
          >
            <span className="text-lg text-yellow-400">★</span>
            <span className="text-sm font-semibold text-gray-700">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">/ 5</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {product.stock === 0 ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
