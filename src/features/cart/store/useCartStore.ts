import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types";
export interface CartItem {
  product: Product;
  quantity: number;
}
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find((item) => item.product.id === product.id);

        if (existingItem) {
          return {
            items: state.items.map((item) => item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item),
          };
        }

        return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) => item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item),
      })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "react-store-cart" },
  ),
);

export const selectCartCount = (state: CartState) => state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state: CartState) => state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);