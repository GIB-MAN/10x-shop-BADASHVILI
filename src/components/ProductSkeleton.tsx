// Skeleton ბარათები პროდუქტების ჩატვირთვისას
function ProductSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
      aria-hidden="true"
    >
      {/* Product Image Skeleton */}
      <div className="aspect-square bg-gray-200" />

      <div className="p-4">
        {/* Category */}
        <div className="mb-3 h-4 w-1/3 rounded bg-gray-200" />

        {/* Product Title */}
        <div className="mb-2 h-5 w-full rounded bg-gray-200" />
        <div className="mb-4 h-5 w-2/3 rounded bg-gray-200" />

        {/* Brand and Rating */}
        <div className="flex justify-between">
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
        </div>
      </div>

      {/* Price */}
      <div className="flex gap-2 px-4 pb-3">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="h-5 w-14 rounded bg-gray-200" />
      </div>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default ProductSkeleton;
