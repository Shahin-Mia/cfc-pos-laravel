// import Button from '@mui/material/Button';
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
    cart,
    product,
    discount,
    open,
    setOpen,
    setCart,
    setProduct,
    setDiscount
}: any) {

    const handleClose = () => {
        setProduct(null);
        setOpen(false);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const quantity = formJson.quantity;
        const comment = formJson.comment;

        if (product) {
            const newCart = cart.map((item: any) => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        quantity: quantity,
                        comment,
                    }
                }
                return item;
            });
            setCart(newCart);
            setProduct(null);
        } else {
            setDiscount(formJson.discount);
        }
        handleClose();
    }

    const handleRemove = () => {
        if (product) {
            const newCart = cart.filter((item: any) => item.id !== product.id);
            setCart(newCart);
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
