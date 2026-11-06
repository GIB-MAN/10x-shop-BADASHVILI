/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";
import { discountedPrice } from "../utils/price";

const PROMO_CODE = "save10x";
const DISCOUNT_RATE = 0.1;

type CartContextType = {
  items: CartItem[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (product: Product, quantity: number) => string | null;
  updateQuantity: (productId: number, quantity: number) => string | null;
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
    (sum, item) =>
      sum +
      discountedPrice(
        item.product.price,
        item.product.discountPercentage,
      ) *
        item.quantity,
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
  function addToCart(product: Product, quantity: number,): string | null {
    // მარაგისა და რაოდენობის შემოწმება
    if (product.stock < 1 || quantity < 1) {
      return "This product is out of stock.";
    }

    // ვიპოვოთ, უკვე არის თუ არა პროდუქტი კალათაში
    const existingItem = items.find(
      (item) => item.product.id === product.id,
    );

    // კალათაში არსებული რაოდენობა
    const currentQuantity = existingItem?.quantity ?? 0;

    // რამდენის დამატება შეიძლება
    const availableQuantity = product.stock - currentQuantity;

    // მარაგი სრულად ამოწურულია
    if (availableQuantity <= 0) {
      return `Maximum available quantity is ${product.stock}.`;
    }

    // თუ მოთხოვნილი რაოდენობა მარაგს აჭარბებს
    const quantityToAdd = Math.min(
      quantity,
      availableQuantity,
    );

    // კალათის განახლება
    setItems((currentItems) => {
      const itemExists = currentItems.some(
        (item) => item.product.id === product.id,
      );

      if (itemExists) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: quantityToAdd,
        },
      ];
    });

    // მომხმარებლისთვის შეტყობინება
    if (quantity > availableQuantity) {
      return `Only ${quantityToAdd} item(s) added. Maximum stock: ${product.stock}.`;
    }

    return null;
  }


  // კალათაში არსებული პროდუქტის რაოდენობის შეცვლა
  function updateQuantity(productId: number, quantity: number): string | null {
    const item = items.find(
      (item) => item.product.id === productId,
    );

    if (!item) {
      return null;
    }

    if (item.product.stock < 1 || quantity > item.product.stock) {
      return `Maximum available quantity is ${item.product.stock}.`;
    }

    if (quantity < 1) {
      return null;
    }

    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.product.id === productId
          ? { ...currentItem, quantity }
          : currentItem,
      ),
    );

  return null;
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
      value={{ items, promoCode, subtotal, discount, total, addToCart, updateQuantity, removeFromCart, applyPromoCode, removePromoCode, clearCart, }}
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
