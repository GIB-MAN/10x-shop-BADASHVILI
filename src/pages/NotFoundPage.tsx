import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>

      <p className="mt-3 text-gray-600">
        ეს გვერდი ვერ მოიძებნა.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        უკან
      </Link>
    </section>
  );
}

export default NotFoundPage;