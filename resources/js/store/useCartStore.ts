import { create } from "zustand";
import { cartSlice } from "./slices/cartSlilce";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            ...cartSlice(set, get),
        }),
        {
            name: 'cart-store',
        }
    )
);