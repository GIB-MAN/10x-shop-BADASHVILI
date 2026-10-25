
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
};

type CartProviderProps = {
  children: ReactNode;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

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

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart }}
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
