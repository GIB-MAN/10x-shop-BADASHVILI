import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Page not found
      </h1>

      <p className="mt-3 text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Go to catalog
      </Link>
    </section>
  );
}

export default NotFoundPage;