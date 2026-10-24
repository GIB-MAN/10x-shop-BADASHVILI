import { useParams } from "react-router-dom";

function ProductPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Product Details</h1>

      <p className="mt-3 text-gray-600">
        Product ID: {id}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        პროდუქციის მონაცემებს წამოვიღებ DummyJSON დან.
      </p>
    </section>
  );
}

export default ProductPage;