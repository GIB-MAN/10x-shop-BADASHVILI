
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  // კალათაში არსებული ყველა პროდუქტის საერთო ღირებულება
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          კალათა
        </h1>

        <p className="mt-3 text-gray-600">
          კალათა ჯერ ცარიელია.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          პროდუქტების ნახვა
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        ჩემი კალათა
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
                ფასი: ${item.product.price.toFixed(2)}
              </p>

              <p className="mt-2 font-semibold text-blue-600">
                ჯამი: ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.quantity - 1,
                  )
                }
                disabled={item.quantity <= 1}
                aria-label={`${item.product.title} რაოდენობის შემცირება`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <span
                aria-live="polite"
                className="min-w-6 text-center font-semibold"
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.quantity + 1,
                  )
                }
                disabled={item.quantity >= item.product.stock}
                aria-label={`${item.product.title} რაოდენობის გაზრდა`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                წაშლა
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-gray-50 p-6 sm:flex-row sm:items-center">
        <p className="text-xl font-bold text-gray-900">
          საერთო ჯამი: ${totalPrice.toFixed(2)}
        </p>

        <Link
          to="/checkout"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          შეკვეთის გაფორმება
        </Link>
      </div>
    </section>
  );
}

export default CartPage;
