import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-blue-600 ${
    isActive ? "text-blue-600" : "text-gray-700"
  }`;

function Header() {
  const { username, isAuthenticated, logout } = useAuth();
  
  // cartQuantity ვითვლის ყველა პროდუქტის რაოდენობის ჯამს
  // თითოეული პროდუქციის რაოდენობის გათვალისწინებით

  const { items } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate the total quantity of products in the cart
  const cartQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          10X Shop
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 sm:flex sm:gap-6"
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
              aria-label={`Cart contains ${cartQuantity} items`}
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 sm:hidden"
        >
          <span className="text-2xl leading-none">
            {isMenuOpen ? "×" : "☰"}
          </span>
        </button>

        {/* Mobile Dropdown Navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute right-4 top-full z-50 mt-2 flex min-w-48 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:hidden"
          >
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navLinkClass}
            >
              Catalog
            </NavLink>

            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-gray-700"
                }`
              }
            >
              Cart

              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {cartQuantity}
              </span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <span className="border-t border-gray-100 pt-3 text-sm font-medium text-gray-700">
                  {username}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-left text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={navLinkClass}
              >
                Log in
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
