import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="py-12 text-center sm:py-20">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
        მოგესალმებით
      </p>

      <h1 className="text-2xl font-bold tracking-tight sm:text-5xl">
        იპოვნეთ თქვენთვის სასურველი ნივთი
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        მარკეტინგული ტექსტები კლიენტის მიდიზვის მიზნით :) 
      </p>

      <Link
        to="/products/1"
        className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View a product
      </Link>
    </section>
  );
}

export default HomePage;