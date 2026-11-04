import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-blue-600 ${
    isActive ? "text-blue-600" : "text-gray-700"
  }`;

function Header() {
  const { username, isAuthenticated, logout } = useAuth();

  const { items } = useCart();

  // cartQuantity ვითვლის ყველა პროდუქტის რაოდენობის ჯამს
  // თითოეული პროდუქციის რაოდენობის გათვალისწინებით

  const cartQuantity = items.reduce(   
    (total, item) => total + item.quantity,
      0,
    );


  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          10X Shop
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-4 sm:gap-6"
        >
          <NavLink to="/" end className={navLinkClass}>
            Catalog
          </NavLink>

          
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive ? "text-blue-600" : "text-gray-700"
              }`
            }
          >
            Cart

            <span
              className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white"
              aria-label={`კალათაში ${cartQuantity} ერთეულია`}
            >
              {cartQuantity}
            </span>
          </NavLink>


          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>

              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;