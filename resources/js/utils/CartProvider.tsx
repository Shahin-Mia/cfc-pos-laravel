import { createContext, ReactNode, useContext, useState } from "react"

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children?: ReactNode }) {
    const [cart, setCart] = useState<any>([]);
    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);
