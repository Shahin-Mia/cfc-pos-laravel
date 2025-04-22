export const cartSlice = (set: any, get: any) => ({
    cart: [],
    discount_title: "",
    discount: 0,
    addToCart: (item: any) => {
        set((state: any) => ({
            cart: state.cart.some((i: any) => i.id === item.id)
                ? state.cart.map((i: any) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...state.cart, { ...item, quantity: 1 }],
        }))
    },

    updateCartItem: (item: any, quantity: any, comment: any) => set((state: any) => ({
        cart: state.cart.map((i: any) => {
            if (i.id === item.id) {
                return {
                    ...i,
                    quantity: quantity,
                    comment: comment,
                };
            }
        })
    })),

    clearCart: () => set(() => ({
        cart: [],
    })),

    removeFromCart: (item: any) => set((state: any) => ({
        cart: state.cart.filter((i: any) => i.id !== item.id),
    })),

    setDiscount: (discount: any) => set(() => ({
        discount_title: discount.title,
        discount: discount.percentage,
    })),

    subTotalPrice: () => {
        return Number(
            get().cart.reduce(
                (sum: any, item: any) => sum + item.sale_price * item.quantity,
                0
            ).toFixed(2)
        );
    },

    tax: () => {
        return Number((get().subTotalPrice() * 0.06).toFixed(2));
    },

    totalPrice: () => {
        return Number(
            (Math.round((get().subTotalPrice() + get().tax() - get().discountAmount()) * 20) / 20).toFixed(2)
        );

    },

    discountAmount: () => {
        return Number(
            (get().subTotalPrice() * get().discount / 100).toFixed(2)
        );
    },

    roundings: () => {
        return Number(
            (get().totalPrice() - (get().subTotalPrice() + get().tax() - get().discountAmount())
            ).toFixed(2));
    }
});