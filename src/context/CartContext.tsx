/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";
//import { discountedPrice } from "../utils/price";
import { Cart } from "../models/Cart";

const PROMO_CODE = "10X10";

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

// კალათის მდგომარეობა
type CartState = {
  items: CartItem[];
  promoCode: string | null;
};

// კალათაზე შესაძლო ქმედებები
// type CartAction =
//   | { type: "ADD_ITEM"; product: Product; quantity: number }
//   | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
//   | { type: "REMOVE_ITEM"; productId: number }
//   | { type: "APPLY_PROMO" }
//   | { type: "REMOVE_PROMO" }
//   | { type: "CLEAR_CART" };

// კალათაზე შესაძლო ქმედებები
type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

// საწყისი მდგომარეობა
const initialState: CartState = {
  items: [],
  promoCode: null,
};

// Reducer: კალათის მდგომარეობის ყველა ცვლილება ერთ ადგილას
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // პროდუქტის დამატება
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id,
      );

      const currentQuantity = existingItem?.quantity ?? 0;
      const newQuantity = currentQuantity + action.qty;

      // მარაგის გადაჭარბების შემთხვევაში state არ იცვლება
      if (
        !Number.isInteger(action.qty) ||
        action.qty < 1 ||
        newQuantity > action.product.stock
      ) {
        return state;
      }

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.qty,
          },
        ],
      };
    }

    // რაოდენობის შეცვლა
    case "SET_QTY": {
      const item = state.items.find(
        (item) => item.product.id === action.productId,
      );

      if (
        !item ||
        !Number.isInteger(action.qty) ||
        action.qty < 1 ||
        action.qty > item.product.stock
      ) {
        return state;
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.qty }
            : item,
        ),
      };
    }

    // პროდუქტის წაშლა
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      };

    // კალათის გასუფთავება
    case "CLEAR":
      return {
        items: [],
        promoCode: null,
      };

    // პრომოკოდის გააქტიურება
    case "APPLY_PROMO":
      return action.code.trim().toLowerCase() === PROMO_CODE.toLowerCase()
        ? { ...state, promoCode: PROMO_CODE }
        : state;

    // პრომოკოდის გაუქმება
    case "REMOVE_PROMO":
      return {
        ...state,
        promoCode: null,
      };

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { items, promoCode } = state;


  // კალათის ჯამი ფასდაკლებამდე
  // const subtotal = items.reduce(
  //   (sum, item) =>
  //     sum +
  //     discountedPrice(
  //       item.product.price,
  //       item.product.discountPercentage,
  //     ) *
  //       item.quantity,
  //   0,
  // );

const cart = new Cart(items, promoCode);

const subtotal = cart.subtotal;


  // პრომოკოდის შემოწმება და გააქტიურება
  function applyPromoCode(code: string): boolean {
    if (code.trim().toLowerCase() !== PROMO_CODE.toLowerCase()) {
      return false;
    }

    dispatch({ type: "APPLY_PROMO", code, });
    return true;
  }

  // ფასდაკლების გაუქმება
  function removePromoCode() {
    dispatch({ type: "REMOVE_PROMO" });
  }

  // ფასდაკლების თანხა
  const discount = cart.discount;
  
  // საბოლოო გადასახდელი თანხა
  // const total = Math.max(0, subtotal - discount);
  const total = cart.total;

  // პროდუქტის კალათაში დამატება
  function addToCart(
    product: Product,
    quantity: number,
  ): string | null {
    const existingItem = items.find(
      (item) => item.product.id === product.id,
    );

    const currentQuantity = existingItem?.quantity ?? 0;

    const availableQuantity = product.stock - currentQuantity;

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      product.stock < 1
    ) {
      return "This product is out of stock.";
    }

    if (quantity > availableQuantity) {
      return `Maximum available quantity is ${availableQuantity}.`;
    }

    dispatch({
      type: "ADD_ITEM",
      product,
      qty: quantity,
    });

    return null;
  }






  // კალათაში არსებული პროდუქტის რაოდენობის შეცვლა
  function updateQuantity(
    productId: number,
    quantity: number,
  ): string | null {
    const item = items.find(
      (item) => item.product.id === productId,
    );

    if (!item) {
      return null;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return null;
    }

    if (quantity > item.product.stock) {
      return `Maximum available quantity is ${item.product.stock}.`;
    }

    dispatch({
      type: "SET_QTY",
      productId,
      qty: quantity,
    });

    return null;
  }






  // პროდუქტის კალათიდან წაშლა
  function removeFromCart(productId: number) {
    dispatch({ type: "REMOVE_ITEM", productId });
  }

  // კალათის კალათისა და პრომოკოდის გასუფთავება
  function clearCart() {
    dispatch({ type: "CLEAR" });
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
