import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useCart } from "@/utils/CartProvider";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft } from "@mui/icons-material";
import { Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

function Checkout() {
    const { cart, totalPrice } = useCart();
    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
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
                                                <TableCell sx={{ padding: 1 }}>{item.name}</TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{item.quantity}</TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{(item.quantity * item.price).toFixed(2)}</TableCell>
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
                                Total: {totalPrice}<Typography variant="overline">RM</Typography>
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
                            <Typography variant="subtitle1" sx={{ display: "inline-block", margin: 0.5 }}>RM</Typography>
                            {totalPrice}
                        </Typography>
                        <Divider variant="middle" sx={{ width: "100%" }} />
                        <Typography variant="button" sx={{ padding: 1 }}>Payment Method</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" component={Link} href={route('order.complete')}>Cash</Button>
                            <Button variant="contained">Card</Button>
                            <Button variant="contained">Online</Button>

                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Checkout