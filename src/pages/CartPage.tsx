import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantityPicker from "../components/QuantityPicker";
import RemoveButton from "../components/RemoveButton";

function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [quantityMessage, setQuantityMessage] = useState<string | null>(null);

  // კალათაში არსებული ყველა პროდუქტის საერთო ღირებულება
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Cart
        </h1>

        <p className="mt-3 text-gray-600">
          The cart is still empty.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Products
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Cart
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.product.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
          >
            <img
              src={item.product.thumbnail}
              alt={item.product.title}
              className="h-24 w-24 rounded-lg bg-gray-50 object-contain"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900">
                {item.product.title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Price: ${item.product.price.toFixed(2)}
              </p>

              <p className="mt-2 font-semibold text-blue-600">
                Total: ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          
            <div className="flex flex-wrap items-center gap-3">
              <QuantityPicker
                quantity={item.quantity}
                maxQuantity={item.product.stock}
                onQuantityChange={(quantity) => {
                  const result = updateQuantity(item.product.id, quantity);
                  setQuantityMessage(result);
                }}
              />

              {quantityMessage && (
                <p role="alert" className="text-xs text-red-600">
                  {quantityMessage}
                </p>
              )}
              <RemoveButton
                onRemove={() => removeFromCart(item.product.id)}
              />
            </div>

          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-gray-50 p-6 sm:flex-row sm:items-center">
        <p className="text-xl font-bold text-gray-900">
          Total Price: ${totalPrice.toFixed(2)}
        </p>

        <Link
          to="/checkout"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Place Order
        </Link>
      </div>
    </section>
  );
}

export default CartPage;
