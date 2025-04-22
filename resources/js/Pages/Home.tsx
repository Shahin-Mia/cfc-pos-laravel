import { Head, router } from '@inertiajs/react';
import { Alert, Box, Button, Card, CardContent, CardMedia, Collapse, Divider, IconButton, Paper, Snackbar, SnackbarCloseReason, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import Item from '@/Components/Item';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCart } from '@/utils/CartProvider';
import { useCartStore } from '@/store/useCartStore';
import axios from 'axios';

export default function Home({ Menus, Meals }: any) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [activeMenu, setActiveMenu] = useState<number>(1);
    const [meals, setMeals] = useState<any>([]);
    const [activeCart, setActiveCart] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const cart = useCartStore((state: any) => state.cart);
    const addToCart = useCartStore((state: any) => state.addToCart);
    const subTotal = useCartStore((state: any) => state.subTotalPrice());
    const tax = useCartStore((state: any) => state.tax());
    const totalPrice = useCartStore((state: any) => state.totalPrice());
    const discountAmount = useCartStore((state: any) => state.discountAmount());
    const discount = useCartStore((state: any) => state.discount);
    const roundings = useCartStore((state: any) => state.roundings());

    useEffect(() => {
        const fetchMeals = Meals.filter((meal: any) => meal.meal_category_id === activeMenu);
        setMeals(fetchMeals);
    }, [activeMenu]);

    useEffect(() => {
        axios.post(route("save.cart"), {
            cart: cart
        })
        if (cart.length > 0) {
            setActiveCart(true);
        }
    }, [cart]);


    const handleCheckout = () => {
        if (cart.length > 0) {
            router.get(route("checkout"));
        } else {
            setMessage("Please select an item!");
            setOpenSnackbar(true);
        }
    }

    const handleEditorDelete = (product: any) => {
        setProduct(product);
        setOpen(true);
    }

    const handleOpenCart = () => {
        setActiveCart((prev) => !prev)
    }

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Meals" />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: 'calc(100% - 64px)' }}>
                <Grid container sx={{ overflow: 'auto', height: '100%', flex: 1 }}>
                    <Grid size={{ xs: 3 }} sx={{
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

                        <Stack
                            divider={<Divider />}
                            spacing={1}
                            sx={{ padding: 2, overflowY: 'auto' }}
                        >
                            {
                                Menus.map((menu: any) => (
                                    <Item
                                        key={menu.id}
                                        sx={{
                                            backgroundColor: activeMenu === menu.id ? '#ff5f01' : '#fff',
                                            color: activeMenu === menu.id ? '#fff' : '#000',
                                            cursor: 'pointer',
                                            padding: 2,
                                        }}
                                        onClick={() => setActiveMenu(menu.id)}
                                    >
                                        {menu.name}
                                    </Item>
                                ))
                            }
                        </Stack>
                    </Grid>

                    {/* Meals List */}
                    <Grid size={{ xs: 9 }} sx={{
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
                            backgroundColor: '#f1f1f1', // Track color
                        },
                    }}>
                        <Grid container spacing={2}>
                            {meals.map((meal: any) => (
                                <Grid size={3} key={meal.id}>
                                    <Card sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={() => addToCart(meal)}>
                                        <CardMedia
                                            sx={{ height: 140, width: '100%', margin: 'auto' }}
                                            image={`/storage/${meal.image.image}`}
                                            title={meal.title}
                                        />
                                        <CardContent
                                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                        >
                                            <Typography gutterBottom variant="subtitle2" sx={{ height: 80, fontSize: '1rem' }}>
                                                {meal.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Price: {meal.sale_price} <small>RM</small>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{ height: "100%" }}>
                    <Collapse in={activeCart} orientation='horizontal' collapsedSize={20} sx={{ height: '100%' }}>
                        <Box sx={{
                            width: 300,
                            height: '100%',
                            display: 'flex',
                        }}>
                            <IconButton color="primary" sx={{ height: '100%', width: 18, borderRadius: 0 }} onClick={handleOpenCart}>
                                {
                                    activeCart ? <ChevronRight /> : <ChevronLeft />
                                }
                            </IconButton>
                            <Paper sx={{ width: '100%', height: '100%', padding: 1, overflowY: 'auto' }}>
                                <Typography variant='h6' sx={{ marginBottom: 2, textAlign: "center" }}>Cart</Typography>
                                <TableContainer sx={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                                    <Table>
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
                                                        onClick={() => handleEditorDelete(item)}
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
                                {
                                    cart.length > 0 && (
                                        <Paper sx={{ position: 'sticky', bottom: 0, width: '100%', margin: 0 }}>
                                            <Box sx={{ padding: 1 }}>
                                                <Typography variant='body1' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Sub total:</span>
                                                    <span>{subTotal}</span>
                                                </Typography>
                                                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>SST:</span>
                                                    <span>(+6%) {tax}</span>
                                                </Typography>
                                                {
                                                    discount > 0 &&
                                                    <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Discount:</span>
                                                        <span>(-{discount}%) {discountAmount} </span>
                                                    </Typography>
                                                }
                                                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Roundings:</span>
                                                    <span>{roundings}</span>
                                                </Typography>
                                                <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Total:</span>
                                                    <span> {totalPrice}<Typography variant="overline">RM</Typography></span>
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                <Button variant='outlined' color='primary' onClick={handleCheckout}>Checkout</Button>
                                                <Button variant="text" size='small' onClick={() => setOpen(true)}>
                                                    Add Discount
                                                </Button>
                                            </Box>
                                        </Paper>
                                    )
                                }
                            </Paper>
                        </Box>
                    </Collapse>
                </Box>
            </Box >
            <Modal
                product={product}
                open={open}
                setOpen={setOpen}
                setProduct={setProduct}
            />
        </AuthenticatedLayout >
    );
}
