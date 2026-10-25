
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface CheckoutValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
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
  const handleSubmit = (
    values: CheckoutValues,
  ) => {
    alert("შეკვეთა წარმატებით გაიგზავნა!");

    console.log("შეკვეთა", values);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const errorClass = "mt-1 text-sm text-red-600";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        შეკვეთა
      </h1>

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
