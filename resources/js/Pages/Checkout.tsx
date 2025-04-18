import PaymentModal from "@/Components/PaymentModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useCart } from "@/utils/CartProvider";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ChevronLeft } from "@mui/icons-material";
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, Paper, Radio, RadioGroup, Snackbar, SnackbarCloseReason, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SyntheticEvent, useEffect, useState } from "react";

function Checkout() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState<string>("");
    const { cart, totalPrice, setCart } = useCart();
    const { data, setData, post } = useForm({
        order_type: "",
        payment_method: "",
        total_price: totalPrice,
        cart: cart
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (cart.length <= 0) {
            router.get(route("home"));
        }
    }, [cart])

    const handleMethodClick = (value: string) => {
        if (data.order_type) {
            setData("payment_method", value);
            setOpen(true);
        } else {
            setMessage("Select Order Type!");
            setOpenSnackbar(true);
        }
    };

    const handleSubmit = () => {
        post(route("order.complete"), {
            onSuccess: () => {
                setCart([]);
            },
        });
    }

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert
                    onClose={handleClose}
                    severity={"error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Grid container sx={{ height: 'calc(100% - 64px)' }}>
                <Grid size={{ xs: 4 }} sx={{
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    height: "100%",
                }}>
                    <Paper elevation={2} square sx={{
                        height: '100%', marginX: 1, display: "flex", flexDirection: "column"
                    }}>
                        <Typography variant='h6' sx={{ textAlign: "center", padding: 0.5 }}>Cart</Typography>
                        <TableContainer sx={{
                            margin: 0,
                            padding: 0,
                            flex: 1,
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': {
                                width: '5px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#555',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            }
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ padding: 1 }}>Meals</TableCell>
                                        <TableCell align='center' sx={{ padding: 1 }}>Quantity</TableCell>
                                        <TableCell align='center' sx={{ padding: 1 }}>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        cart.map((item: any) => (
                                            <TableRow
                                                key={item.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: '#f8f8f8' } }}
                                            >
                                                <TableCell sx={{ padding: 1 }}>
                                                    <Typography variant='body2'>{item.title}</Typography>
                                                    {item.comment && <Typography variant='caption'>* {item.comment}</Typography>}
                                                </TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{item.quantity}</TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{(item.quantity * item.sale_price).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Paper sx={{ padding: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Button variant="text" size='small' component={Link} href={route("home")}>
                                <ChevronLeft /> Change order
                            </Button>
                            <Typography variant="h6">
                                Total: {totalPrice}<Typography variant="overline" component="span">RM</Typography>
                            </Typography>
                        </Paper>
                    </Paper>

                </Grid>

                <Grid size={{ xs: 8 }} sx={{
                    padding: 2,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                    height: "100%",
                    '&::-webkit-scrollbar': {
                        width: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                    },
                }}>
                    <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
                        <Typography variant="h6">Due Payment</Typography>
                        <Typography variant="h4">
                            <Typography variant="subtitle1" component="span" sx={{ display: "inline-block", margin: 0.5 }}>RM</Typography>
                            {totalPrice}
                        </Typography>
                        <Divider variant="middle" sx={{ width: "100%" }} />
                        <Box
                            component="form"
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <Typography variant="button">Order Type</Typography>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="order-type-label"
                                    name="order_type"
                                    onChange={(e) => setData("order_type", e.target.value)}
                                >
                                    <FormControlLabel value="dine-in" control={<Radio />} label="Dine in" />
                                    <FormControlLabel value="takeaway" control={<Radio />} label="Take away" />
                                    <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                                </RadioGroup>
                            </FormControl>
                            <Divider variant="middle" sx={{ width: "100%" }} />
                            <Typography variant="button" sx={{ padding: 1 }}>Payment Method</Typography>
                            <Stack direction="row" spacing={2}>
                                <Button type="button" variant="contained" onClick={() => handleMethodClick("cash")}>Cash</Button>
                                <Button type="button" variant="contained" onClick={() => handleMethodClick("card")}>Card</Button>
                                <Button type="button" variant="contained" onClick={() => handleMethodClick("online")}>Online</Button>

                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <PaymentModal
                open={open}
                setOpen={setOpen}
                totalPrice={totalPrice}
                payment_method={data.payment_method}
                handleSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    )
}

export default Checkout