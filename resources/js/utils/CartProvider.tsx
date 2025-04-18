import { createContext, ReactNode, useContext, useState } from "react"

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children?: ReactNode }) {
    const [cart, setCart] = useState<any>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<any>({
        percentage: 0,
        title: ""
    });
    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            totalPrice,
            setTotalPrice,
            discount,
            setDiscount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);
