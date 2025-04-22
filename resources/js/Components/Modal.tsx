// import Button from '@mui/material/Button';
import { useCartStore } from '@/store/useCartStore';
import { useCart } from '@/utils/CartProvider';
import { router } from '@inertiajs/react';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { forwardRef, useState } from 'react';

const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props}>{props.children}</Slide>;
});

export default function Modal({
    product,
    open,
    setOpen,
    setProduct
}: any) {

    const { totalPrice } = useCart();
    const updateCartItem = useCartStore((state: any) => state.updateCartItem);
    const removeFromCart = useCartStore((state: any) => state.removeFromCart);
    const setDiscount = useCartStore((state: any) => state.setDiscount);
    const discount_title = useCartStore((state: any) => state.discount_title);
    const discount = useCartStore((state: any) => state.discount);

    const handleClose = () => {
        if (product) {
            setProduct(null);
        }
        setOpen(false);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const quantity = formJson.quantity;
        const comment = formJson.comment;

        if (product) {
            updateCartItem(product, quantity, comment);
            setProduct(null);
        } else {
            const newDiscount = {
                title: formJson.discount_title.toString(),
                percentage: parseFloat(formJson.discount.toString()),
            }
            setDiscount(newDiscount);
        }
        handleClose();
    }

    const handleRemove = () => {
        if (product) {
            removeFromCart(product);
            setProduct(null);
        }
        handleClose();
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>
                    {
                        product ? "Edit" : "Add Discount"
                    }
                </DialogTitle>
                <DialogContent>
                    {
                        product &&
                        <DialogContentText>
                            {product.name}
                        </DialogContentText>
                    }
                    {
                        product ? (
                            <>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="quantity"
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    defaultValue={product.quantity}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    type="text"
                                    fullWidth
                                    defaultValue={product.comment}
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    name="discount_title"
                                    label="Discount Title"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={discount_title}
                                />
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    name="discount"
                                    label="Discount"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={discount}
                                />
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button onClick={handleClose}>Cancel</Button>
                        {
                            product &&
                            <Button onClick={handleRemove} variant='contained' size='small' color='error'>Remove</Button>
                        }
                    </div>
                    <Button type="submit" >
                        {product ? 'Save' : 'Apply Discount'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
