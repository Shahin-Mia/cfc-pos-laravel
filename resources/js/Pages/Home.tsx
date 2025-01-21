import { Head, Link } from '@inertiajs/react';
import { Meals, Menus } from '@/utils/fakeData';
import { Box, Button, Card, CardContent, CardMedia, Collapse, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useContext, useEffect, useMemo, useState } from 'react';
import Item from '@/Components/Item';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCart } from '@/utils/CartProvider';

export default function Home() {
    const [activeMenu, setActiveMenu] = useState<number>(1);
    const [meals, setMeals] = useState<any>([]);
    const [activeCart, setActiveCart] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const { cart, setCart, totalPrice, setTotalPrice, discount, setDiscount } = useCart();

    const amount = useMemo(() => {
        let subtotal = cart.reduce((acc: any, item: any) => acc + item.quantity * item.price, 0).toFixed(0);
        if (discount > 0) {
            subtotal -= subtotal * (discount / 100);
            subtotal = subtotal.toFixed(2);
        }
        const tax = (subtotal * 0.06).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
        setTotalPrice(total);
        return { subtotal, total };
    }, [cart, discount]);

    useEffect(() => {
        const fetchMeals = Meals.filter((meal) => meal.menuId === activeMenu);
        if (cart.length > 0) setActiveCart(true);
        setMeals(fetchMeals);
    }, [activeMenu]);

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

    return (
        <AuthenticatedLayout>
            <Head title="Meals" />
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
                            backgroundColor: '#f1f1f1', // Track color
                        },
                    }}>

                        <Stack
                            divider={<Divider />}
                            spacing={1}
                            sx={{ padding: 2, overflowY: 'auto' }}
                        >
                            {Menus.map((menu) => (
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
                            ))}
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
                                            image={`/storage/images/${meal.image}`}
                                            title={meal.name}
                                        />
                                        <CardContent
                                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                        >
                                            <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: 50, fontSize: '1rem' }}>
                                                {meal.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Price: {meal.price} <small>RM</small>
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
                                                        <TableCell sx={{ padding: 1 }}>{item.name}</TableCell>
                                                        <TableCell align='center' sx={{ padding: 1 }}>{item.quantity}</TableCell>
                                                        <TableCell align='center' sx={{ padding: 1 }}>{(item.quantity * item.price).toFixed(2)}</TableCell>
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
                                                {
                                                    discount > 0 &&
                                                    <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Discount:</span>
                                                        <span>(-) {discount}%</span>
                                                    </Typography>
                                                }
                                                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>SST:</span>
                                                    <span>(+) 6%</span>
                                                </Typography>
                                                <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Total:</span>
                                                    <span> {amount.total}<Typography variant="overline">RM</Typography></span>
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                <Button variant='outlined' color='primary' component={Link} href={route("checkout")} >Checkout</Button>
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
