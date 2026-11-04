
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../types";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState<LoginFormValues>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = form.username.trim();
    const password = form.password;

    const newErrors = {
      username: "",
      password: "",
    };

if (!username) {
      newErrors.username = "Username is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (newErrors.username || newErrors.password) {
      return;
    }

    login(username);

    const from = location.state?.from;
    const redirectTo =
      typeof from === "string" && from.startsWith("/")
        ? from
        : "/";

    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Login</h1>

      <p className="mt-2 text-gray-600">
        Login is a required condition for making purchases.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
            }`}
          />

          {errors.username && (
            <p
              id="username-error"
              role="alert"
              className="mt-1 text-sm text-red-600"
            >
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
            }`}
          />

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-1 text-sm text-red-600"
            >
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      
      <div className="mt-5 text-center">
        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to catalog
        </Link>
      </div>

    </section>
  );
}

export default LoginPage;
