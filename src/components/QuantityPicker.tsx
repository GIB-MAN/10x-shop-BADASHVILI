
type QuantityPickerProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
};

function QuantityPicker({
  quantity,
  maxQuantity,
  onQuantityChange,
}: QuantityPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="რაოდენობის შემცირება"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>

      <span
        aria-live="polite"
        className="min-w-6 text-center font-semibold"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={quantity >= maxQuantity}
        aria-label="რაოდენობის გაზრდა"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export default QuantityPicker;
