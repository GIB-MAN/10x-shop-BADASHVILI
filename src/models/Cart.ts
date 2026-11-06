import type { CartItem } from "../types";
import { discountedPrice } from "../utils/price";

const PROMO_CODE = "10X10";
const DISCOUNT_RATE = 0.1;

export class Cart {
  private items: CartItem[];
  private promoCode: string | null;

  constructor(items: CartItem[], promoCode: string | null = null) {
    this.items = items;
    this.promoCode = promoCode;
  }

  // პროდუქტების ჯამი ფასდაკლების გათვალისწინებით
  get subtotal(): number {
    return this.items.reduce(
      (sum, item) =>
        sum +
        discountedPrice(
          item.product.price,
          item.product.discountPercentage,
        ) *
          item.quantity,
      0,
    );
  }

  // პრომოკოდის ფასდაკლება
  get discount(): number {
    return this.promoCode === PROMO_CODE
      ? this.subtotal * DISCOUNT_RATE
      : 0;
  }

  // საბოლოო გადასახდელი თანხა
  get total(): number {
    return Math.max(0, this.subtotal - this.discount);
  }
}