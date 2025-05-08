import { create } from "zustand";
import { cartSlice } from "./slices/cartSlilce";
import { persist } from "zustand/middleware";
import { sessionSlice } from "./slices/sessionSlice";

export const useCartStore = create(
    persist(
        (set, get) => ({
            ...cartSlice(set, get),
            ...sessionSlice(set, get),
        }),
        {
            name: 'cart-store',
        }
    )
);