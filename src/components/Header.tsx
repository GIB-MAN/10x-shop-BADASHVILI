import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-blue-600 ${
    isActive ? "text-blue-600" : "text-gray-700"
  }`;

function Header() {
  const { username, isAuthenticated, logout } = useAuth();
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
            Home
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            Cart
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
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;