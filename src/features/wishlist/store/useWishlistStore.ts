import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => set((state) => state.items.some((item) => item.id === product.id) ? state : { items: [...state.items, product] }),

      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),

      toggleItem: (product) => set((state) => ({
        items: state.items.some((item) => item.id === product.id)
          ? state.items.filter((item) => item.id !== product.id)
          : [...state.items, product],
      })),

      isFavorite: (productId) => get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "react-store-wishlist" },
  ),
);

export const selectWishlistCount = (state: WishlistState) => state.items.length;
