import { Head, Link, router } from '@inertiajs/react';
import { Alert, Box, Button, Card, CardContent, CardMedia, Collapse, Divider, IconButton, Paper, Snackbar, SnackbarCloseReason, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';
import Item from '@/Components/Item';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCart } from '@/utils/CartProvider';

export default function Home({ Menus, Meals, OpenSessionModal }: any) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [activeMenu, setActiveMenu] = useState<number>(1);
    const [meals, setMeals] = useState<any>([]);
    const [activeCart, setActiveCart] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const { cart, setCart, setTotalPrice, discount, setDiscount } = useCart();

    const amount = useMemo(() => {
        let subtotal = cart.reduce((acc: any, item: any) => acc + item.quantity * item.sale_price, 0).toFixed(2);
        let discountAmount: any = 0;
        if (discount.percentage > 0) {
            discountAmount = (subtotal * (discount.percentage / 100)).toFixed(2);
        }
        const discountedSubtotal = parseFloat(subtotal) - parseFloat(discountAmount);
        const tax: any = (discountedSubtotal * 0.06).toFixed(2);
        const total: any = (parseFloat(subtotal) + parseFloat(tax) - parseFloat(discountAmount)).toFixed(1);
        const roundAmount = (parseFloat(total) - parseFloat(subtotal) - parseFloat(tax) + parseFloat(discountAmount)).toFixed(2);
        console.log(roundAmount)
        return { subtotal, total, tax, discountAmount, roundAmount };
    }, [cart, discount.percentage]);

    useEffect(() => {
        const fetchMeals = Meals.filter((meal: any) => meal.meal_category_id === activeMenu);
        setMeals(fetchMeals);
    }, [activeMenu]);

    useEffect(() => {
        setActiveCart(cart.length > 0);
    }, [cart]);

    useEffect(() => {
        setTotalPrice(amount.total);
    }, [amount.total]);

    const handleCheckout = () => {
        if (cart.length > 0) {
            router.get(route("checkout"));
        } else {
            setMessage("Please select an item!");
            setOpenSnackbar(true);
        }
    }

    const handleAddToCart = (meal: any) => {
        const isExist = cart.find((item: any) => item.id === meal.id);
        if (isExist) {
            const newCart = cart.map((item: any) => {
                if (item.id === meal.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                }
                return item;
            });
            setCart(newCart);
        } else {
            setCart([...cart, { ...meal, quantity: 1 }]);
        }
        if (!activeCart) setActiveCart(true);
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
                                    <Card sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={() => handleAddToCart(meal)}>
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
                                                    <span>{amount.subtotal}</span>
                                                </Typography>
                                                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>SST:</span>
                                                    <span>(+6%) {amount.tax}</span>
                                                </Typography>
                                                {
                                                    discount.percentage > 0 &&
                                                    <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Discount:</span>
                                                        <span>(-{discount.percentage}%) {amount.discountAmount} </span>
                                                    </Typography>
                                                }
                                                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Roundings:</span>
                                                    <span>{amount.roundAmount}</span>
                                                </Typography>
                                                <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Total:</span>
                                                    <span> {amount.total}<Typography variant="overline">RM</Typography></span>
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
                cart={cart}
                product={product}
                discount={discount}
                open={open}
                setOpen={setOpen}
                setCart={setCart}
                setProduct={setProduct}
                setDiscount={setDiscount}
            />
        </AuthenticatedLayout >
    );
}
