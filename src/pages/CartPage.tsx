import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantityPicker from "../components/QuantityPicker";
import RemoveButton from "../components/RemoveButton";
import { discountedPrice, formatPrice } from "../utils/price";

function CartPage() {
  const { items,
        subtotal,
        discount,
        total,
        updateQuantity,
        removeFromCart,
        clearCart,
 } = useCart();

  // თუ ერთ პროდუქტზე მარაგის შეცდომა დამიფიქსირდა, 
  // მაშინ შეტყობინება ყველა პროდუქტის ბარათთან რომ აღარ გამოჩნდეს.
  const [quantityMessage, setQuantityMessage] = useState<{productId: number; message: string;} | null>(null);

  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Cart
        </h1>

        <p className="mt-3 text-gray-600">
          Your cart is empty.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
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
                    <Link
                      to={`/products/${item.product.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {item.product.title}
                    </Link>
                </h2>

                {/* Product prices */}
                <div className="mt-2 flex flex-wrap items-center gap-2">

                  {/* Original price */}
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(item.product.price)}
                  </span>

                  {/* Discounted price */}
                  <span className="font-semibold text-blue-600">
                    {formatPrice(
                      discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      ),
                    )}
                  </span>

                  {/* Discount percentage */}
                  <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                    -{item.product.discountPercentage.toFixed(0)}%
                  </span>

                </div>

                {/* Line total */}
                <p className="mt-2 font-semibold text-blue-600">
                  Total: {
                    formatPrice(
                      discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      ) * item.quantity,
                    )
                  }
                </p>
              </div>
            
              <div className="flex flex-wrap items-center gap-3">
                <QuantityPicker
                  quantity={item.quantity}
                  maxQuantity={item.product.stock}
                  onQuantityChange={(quantity) => {
                    const result = updateQuantity(item.product.id, quantity);
                    setQuantityMessage(    
                      result
                      ? {
                          productId: item.product.id,
                          message: result,
                        }
                      : null);
                  }}
                />

                {quantityMessage?.productId === item.product.id && (
                  <p role="alert" className="text-xs text-red-600">
                    {quantityMessage.message}
                  </p>
                )}
                <RemoveButton
                  onRemove={() => removeFromCart(item.product.id)}
                />
              </div>

            </article>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 text-sm font-semibold text-red-600 hover:text-red-800"
          >
            Clear cart
          </button>
          
        </div>
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -{formatPrice(discount)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to checkout
            </Link>
          </div>


        </aside>
      </div>


    </section>
  );
}

export default CartPage;
