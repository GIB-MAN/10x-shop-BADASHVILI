
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";

const PROMO_CODE = "save10x";
const DISCOUNT_RATE = 0.1;

type CartContextType = {
  items: CartItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  clearCart: () => void;
};

type CartProviderProps = {
  children: ReactNode;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // კალათის ჯამი ფასდაკლებამდე
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // პრომოკოდის შემოწმება და გააქტიურება
  function applyPromoCode(code: string): boolean {
    if (code.trim().toLowerCase() !== PROMO_CODE) {
      return false;
    }

    setPromoCode(PROMO_CODE);
    return true;
  }

  // ფასდაკლების გაუქმება
  function removePromoCode() {
    setPromoCode(null);
  }

  // ფასდაკლების თანხა
  const discount =
    promoCode === PROMO_CODE ? subtotal * DISCOUNT_RATE : 0;

  // საბოლოო გადასახდელი თანხა
  const total = Math.max(0, subtotal - discount);
  
  // პროდუქტის კალათაში დამატება
  function addToCart(product: Product, quantity: number) {
    if (product.stock < 1 || quantity < 1) {
      return;
    }

    const safeQuantity = Math.min(quantity, product.stock);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + safeQuantity,
                  product.stock,
                ),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        { product, quantity: safeQuantity },
      ];
    });
  }

  // კალათაში არსებული პროდუქტის რაოდენობის შეცვლა
  function updateQuantity(productId: number, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(quantity, item.product.stock),
          ),
        };
      }),
    );
  }

  // პროდუქტის კალათიდან წაშლა
  function removeFromCart(productId: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  }

  // კალათის კალათისა და პრომოკოდის გასუფთავება
  function clearCart() {
    setItems([]);
    setPromoCode(null);
  }

  return (
    <CartContext.Provider
      value={{ items, promoCode, subtotal, discount, total,addToCart, updateQuantity, removeFromCart, applyPromoCode, removePromoCode, clearCart, }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart უნდა გამოიყენებოდეს CartProvider-ის შიგნით.");
  }

  return context;
}
