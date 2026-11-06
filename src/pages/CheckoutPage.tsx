import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCart } from "../context/CartContext";
//import type { CartItem } from "../types";
import type { Order, CheckoutFormValues } from "../types";
import { StorageService } from "../utils/StorageService";
import PromoCodeForm from "../components/PromoCodeForm";
import { discountedPrice, formatPrice } from "../utils/price";


const orderStorage = new StorageService<Order[]>("shop_orders");

const initialValues: CheckoutFormValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};

const checkoutSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name must be at least 3 characters"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address"),

  address: Yup.string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .required("Address must be at least 5 characters"),

  city: Yup.string()
    .trim()
    .required("City is required"),
});

function Checkout() {

  const { items, clearCart, promoCode, subtotal, discount, total, applyPromoCode, removePromoCode, } = useCart();

  const [order, setOrder] = useState<Order | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const errorClass = "mt-1 text-sm text-red-600";


const handleSubmit = (
  values: CheckoutFormValues,
  { setSubmitting }: import("formik").FormikHelpers<CheckoutFormValues>,
) => {
  try {
    setSubmitError(null);

    // ახალი შეკვეთის შექმნა
    const newOrder: Order = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...values,
      items: items.map((item) => ({ ...item })),
      promoCode,
      subtotal,
      discount,
      totalPrice: total,
    };

    // არსებული შეკვეთების წამოღება
    const savedOrders = orderStorage.get([]);

    // ახალი შეკვეთის დამატება და შენახვა
    orderStorage.set([...savedOrders, newOrder]);

    // შეკვეთის დადასტურება
    setOrder(newOrder);

    // კალათის გასუფთავება
    clearCart();

  } catch {
    setSubmitError("Something went wrong. Please try again.");
    setSubmitting(false);
  }
};


  // შეკვეთის წარმატებით გაფორმების შემდეგ
  if (order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mb-3 text-5xl text-green-600">
              ✓
            </div>

            <p className="mt-3 text-gray-600">
              Thank you! Your order has been placed.
            </p>

          </div>

          <div className="space-y-2 border-b border-gray-200 pb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Details
            </h2>

            <p className="text-gray-600">
              Name: {order.fullName}
            </p>

            <p className="text-gray-600">
              Email: {order.email}
            </p>

            <p className="text-gray-600">
              Address: {order.address}, {order.city}
            </p>
          </div>

          <div className="space-y-4 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            {order.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="h-16 w-16 rounded-lg bg-gray-50 object-contain"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} ×{" "}
                    {formatPrice(
                      discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      )
                    )}
                  </p>

                </div>

                <p className="font-semibold text-gray-900">
                  {formatPrice(
                    discountedPrice(
                      item.product.price,
                      item.product.discountPercentage,
                    ) * item.quantity
                  )}
                </p>

              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-5">
            <div className="flex justify-between gap-4 text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            {order.promoCode && (
              <>
                <div className="flex justify-between gap-4 text-sm text-green-700">
                  <span>Promo code</span>
                  <span>{order.promoCode.toUpperCase()}</span>
                </div>

                <div className="flex justify-between gap-4 text-green-700">
                  <span>Discount (10%)</span>
                  <span>−${order.discount.toFixed(2)}</span>
                </div>
              </>
            )}

      <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
        <span className="text-lg font-bold text-gray-900">
          Total
        </span>

        <span className="text-xl font-bold text-blue-600">
          ${order.totalPrice.toFixed(2)}
        </span>
      </div>
    </div>

          <Link
            to="/"
            className="mt-6 inline-flex w-full justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  // თუ კალათა ცარიელია, checkout ფორმა არ გამოჩნდეს
  if (items.length === 0) {
      return (
        <Navigate
          to="/cart"
          replace
          state={{
            message: "Your cart is empty. Add items before checkout.",
          }}
        />
      );
    }


  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Checkout
      </h1>

            <PromoCodeForm
              onApply={applyPromoCode}
              onRemove={removePromoCode}
              appliedCode={promoCode}
            />

      <Formik<CheckoutFormValues>
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, touched, errors }) => (
          <Form className="space-y-5" noValidate>

            {submitError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {submitError}
              </p>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <Field
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                className={`${inputClass} ${
                  touched.fullName && errors.fullName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                placeholder="Enter your full name"
              />

              <ErrorMessage
                name="fullName"
                component="p"
                className={errorClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`${inputClass} ${
                  touched.email && errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                placeholder="you@example.com"
              />

              <ErrorMessage
                name="email"
                component="p"
                className={errorClass}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <Field
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                className={`${inputClass} ${
                  touched.address && errors.address
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                placeholder="Street and house number"
              />

              <ErrorMessage
                name="address"
                component="p"
                className={errorClass}
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                City
              </label>

              <Field
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className={`${inputClass} ${
                  touched.city && errors.city
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                placeholder="Enter your city"
              />

              <ErrorMessage
                name="city"
                component="p"
                className={errorClass}
              />
            </div>

            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.product.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="font-semibold text-gray-900">
                    {formatPrice(
                      discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      ) * item.quantity
                    )}
                  </span>

                </div>
              ))}

              <div className="flex justify-between gap-4 text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {promoCode && (
                <>
                  <div className="flex justify-between gap-4 text-sm text-green-700">
                    <span>Promo code</span>
                    <span>{promoCode.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between gap-4 text-green-700">
                    <span>Discount (10%)</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between gap-4 text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>

            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place Order
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

export default Checkout;
