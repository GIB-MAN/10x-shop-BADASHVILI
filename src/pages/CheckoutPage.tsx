import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types";
import PromoCodeForm from "../components/PromoCodeForm";

interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

interface OrderConfirmation {
  fullName: string;
  email: string;
  address: string;
  city: string;
  items: CartItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  totalPrice: number;
}

const initialValues: CheckoutValues = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};

const checkoutSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("სრული სახელი სავალდებულოა"),

  email: Yup.string()
    .trim()
    .email("გთხოვთ, შეიყვანოთ ელფოსტის სწორი მისამართი")
    .required("ელფოსტა აუცილებელია"),

  address: Yup.string()
    .trim()
    .required("მისამართი აუცილებელია"),

  city: Yup.string()
    .trim()
    .required("ქალაქი აუცილებელია"),
});

function Checkout() {

  const { items, clearCart, promoCode, subtotal, discount, total, applyPromoCode, removePromoCode, } = useCart();

  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const errorClass = "mt-1 text-sm text-red-600";

  const handleSubmit = ( values: CheckoutValues, ) => {

      // შეკვეთის მონაცემები შევინახოთ კალათის გასუფთავებამდე
    setOrder({
      ...values,
      items: items.map((item) => ({ ...item })),
      promoCode,
      subtotal,
      discount,
      totalPrice: total,
    });

    // კალათის გასუფთავება
    clearCart();
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

            <h1 className="text-3xl font-bold text-gray-900">
              გმადლობთ შეკვეთისთვის!
            </h1>

            <p className="mt-3 text-gray-600">
              თქვენი შეკვეთა წარმატებით განთავსდა.
            </p>
          </div>

          <div className="space-y-2 border-b border-gray-200 pb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              შეკვეთის დეტალები
            </h2>

            <p className="text-gray-600">
              სახელი: {order.fullName}
            </p>

            <p className="text-gray-600">
              ელფოსტა: {order.email}
            </p>

            <p className="text-gray-600">
              მისამართი: {order.address}, {order.city}
            </p>
          </div>

          <div className="space-y-4 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              შეკვეთის შეჯამება
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
                    რაოდენობა: {item.quantity} × $
                    {item.product.price.toFixed(2)}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  $
                  {(
                    item.product.price * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-5">
            <div className="flex justify-between gap-4 text-gray-600">
              <span>ჯამური თანხა</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            {order.promoCode && (
              <>
                <div className="flex justify-between gap-4 text-sm text-green-700">
                  <span>პრომოკოდი</span>
                  <span>{order.promoCode.toUpperCase()}</span>
                </div>

                <div className="flex justify-between gap-4 text-green-700">
                  <span>ფასდაკლება (10%)</span>
                  <span>−${order.discount.toFixed(2)}</span>
                </div>
              </>
            )}

      <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
        <span className="text-lg font-bold text-gray-900">
          საბოლოო ჯამი
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
            განაგრძეთ შოპინგი
          </Link>
        </div>
      </main>
    );
  }

  // თუ კალათა ცარიელია, checkout ფორმა არ გამოჩნდეს
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          თქვენი კალათა ცარიელია
        </h1>

        <p className="mt-3 text-gray-600">
          შეკვეთის გაფორმებამდე დაამატეთ პროდუქტები.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          განაგრძეთ შოპინგი
        </Link>
      </main>
    );
  }


  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        შეკვეთა
      </h1>

            <PromoCodeForm
              onApply={applyPromoCode}
              onRemove={removePromoCode}
              appliedCode={promoCode}
            />

      <Formik<CheckoutValues>
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, touched, errors }) => (
          <Form className="space-y-5" noValidate>

            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                სახელი
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
                placeholder="შეიყვანეთ თქვენი სრული სახელი"
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
                ელფოსტა
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
                მისამართი
              </label>

              <Field
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                className={inputClass}
                placeholder="ქუჩა და სახლის ნომერი"
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
                ქალაქი
              </label>

              <Field
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className={inputClass}
                placeholder="შეიყვანეთ თქვენი ქალაქი"
              />

              <ErrorMessage
                name="city"
                component="p"
                className={errorClass}
              />
            </div>

            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>ჯამური თანხა</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {promoCode && (
                <>
                  <div className="flex justify-between gap-4 text-sm text-green-700">
                    <span>აქტიური პრომოკოდი</span>
                    <span>{promoCode.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between gap-4 text-green-700">
                    <span>ფასდაკლება (10%)</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                <span className="text-lg font-bold text-gray-900">
                  გადასახდელი თანხა
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
              შეკვეთის გაფორმება
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

export default Checkout;
