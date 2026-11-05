export function discountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return Number(
    (price * (1 - discountPercentage / 100)).toFixed(2)
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}