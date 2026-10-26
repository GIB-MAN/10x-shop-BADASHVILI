
import { useState } from "react";
import type { FormEvent } from "react";

interface PromoCodeFormProps {
  onApply: (code: string) => boolean;
  onRemove: () => void;
  appliedCode: string | null;
}

function PromoCodeForm({
  onApply,
  onRemove,
  appliedCode,
}: PromoCodeFormProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = onApply(code);

    if (success) {
      setCode("");
      setMessage("პრომოკოდი წარმატებით გააქტიურდა!");
      setHasError(false);
    } else {
      setMessage("არასწორი პრომოკოდი. სცადეთ save10x.");
      setHasError(true);
    }
  }

  function handleRemove() {
    onRemove();
    setMessage("პრომოკოდი გაუქმებულია.");
    setHasError(false);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-bold text-gray-900">
        ფასდაკლების კოდი
      </h2>

      <form onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="promo-code" className="sr-only">
          შეიყვანეთ პრომოკოდი
        </label>

        <input
          id="promo-code"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setMessage("");
          }}
          placeholder="მაგ. save10x"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <button type="submit"
          disabled={!code.trim()}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          გამოყენება
        </button>
      </form>

      {message && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            hasError ? "text-red-600" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}

      {appliedCode && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-green-700">
            აქტიური კოდი: {appliedCode.toUpperCase()}
          </p>

          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            კოდის გაუქმება
          </button>
        </div>
      )}
    </section>
  );
}

export default PromoCodeForm;
