// import Button from '@mui/material/Button';
import { useCartStore } from '@/store/useCartStore';
import { useForm } from '@inertiajs/react';
import { Button, CircularProgress, FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props}>{props.children}</Slide>;
});

export default function StockAddModal({
    product,
    open,
    setOpen,
    setProduct
}: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: '',
        is_available: product ? product.is_available : 0,
    })
    const handleClose = () => {
        if (product) {
            setProduct(null);
        }
        setOpen(false);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        post(route('products.stock.add', product.id), {
            onSuccess: () => {
                setProduct(null);
                setOpen(false);
                reset();
            }
        });
    }

    const handleRemove = () => {
        if (product) {

            setProduct(null);
        } else {

        }
        handleClose();
    }

    return (
        <>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
                TransitionComponent={Transition}
                sx={{
                    zIndex: 50
                }}
            >
                <DialogTitle>
                    Add Stock
                </DialogTitle>
                <DialogContent >
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Title"
                                name="product_name"
                                value={product ? product.title : ''}
                                disabled
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl
                                fullWidth
                                size='small'
                            >
                                <InputLabel>Availability</InputLabel>
                                <Select
                                    value={data.is_available}
                                    onChange={(e) => setData('is_available', e.target.value)}
                                    label="Availability"
                                    name="is_available"
                                    inputProps={{
                                        name: 'is_available',
                                        id: 'is_available',
                                    }}

                                >
                                    <MenuItem value="1">Available</MenuItem>
                                    <MenuItem value="0">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Current Stock"
                                name="product_stock"
                                value={product ? product.stock.stock : ''}
                                disabled
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                autoFocus
                                fullWidth
                                size="small"
                                label="Quantity to Add"
                                type="number"
                                name="quantity"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                error={errors.quantity ? true : false}
                                helperText={errors.quantity ? errors.quantity : ''}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} type="submit" color="primary" variant="contained" size="small">
                        Add Stock
                    </Button>
                    <Button color="error" variant="contained" size="small" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
