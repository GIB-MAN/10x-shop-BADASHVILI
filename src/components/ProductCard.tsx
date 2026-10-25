
import { Link } from "react-router-dom";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`ნახე პროდუქტი: ${product.title}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900">
            {product.title}
          </h2>

          <p className="mt-2 text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            კატეგორია: {product.category}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link
          to={`/products/${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          დეტალების ნახვა
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
