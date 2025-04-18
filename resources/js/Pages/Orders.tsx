import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, router } from "@inertiajs/react"
import { ChevronLeft } from "@mui/icons-material"
import { Box, Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

function Orders({ orders }: any) {
    const [order, setOrder] = useState<any>(orders[0]);
    const handleOrderClick = (event: React.MouseEvent<HTMLTableRowElement>, id: any) => {
        const selectedOrder = orders.find((order: any) => order.id === id);
        if (selectedOrder) {
            setOrder(selectedOrder);
        }
    }

    function formatDateTime(isoString: any) {
        const date = new Date(isoString);
        const pad = (n: any) => n.toString().padStart(2, '0');

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    return (
        <AuthenticatedLayout>
            <Head title="Orders" />
            <Grid container sx={{ height: 'calc(100% - 64px)' }}>
                <Grid size={{ xs: 4 }} sx={{
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    height: "100%",
                }}>
                    <Paper elevation={2} square sx={{
                        height: '100%', marginX: 1, display: "flex", flexDirection: "column"
                    }}>
                        <Typography variant='h6' sx={{ textAlign: "center", padding: 0.5 }}>Orders</Typography>
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
                                        <TableCell sx={{ padding: 1 }}>Order ID</TableCell>
                                        <TableCell align='center' sx={{ padding: 1 }}>Payment Method</TableCell>
                                        <TableCell align='center' sx={{ padding: 1 }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        orders.map((item: any) => (
                                            <TableRow
                                                key={item.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: '#f8f8f8' } }}
                                                onClick={(event) => handleOrderClick(event, item.id)}
                                            >
                                                <TableCell sx={{ padding: 1 }}>{item.id}</TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{item.payment_method}</TableCell>
                                                <TableCell align='center' sx={{ padding: 1 }}>{item.total_price}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                        <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }} alignItems="center">
                            <Button variant="outlined" component={Link} href={route("home")}>
                                <ChevronLeft /> Back
                            </Button>
                            <Typography variant='h6' sx={{ flexGrow: 1, textAlign: "center" }}>Order Details</Typography>
                        </Stack>
                        <Divider sx={{ width: "100%", marginBottom: 2 }} />
                        {/* Order details will be displayed here */}
                        <Box sx={{ width: "100%", padding: 2 }}>
                            <Typography variant='h6'>Order ID:# {order?.id}</Typography>
                            <Typography variant='body1'>Payment Method: {order?.payment_method}</Typography>
                            <Typography variant='body1'>Total Price: {order?.total_price}RM</Typography>
                            <Typography variant='body1'>Order Date: {order && formatDateTime(order.created_at)}</Typography>
                            <Typography variant='body1'>Status: {order?.status}</Typography>
                            <Typography variant='body1'>Items:</Typography>
                            <TableContainer sx={{ marginTop: 2 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ padding: 1 }}>Item Name</TableCell>
                                            <TableCell align='center' sx={{ padding: 1 }}>Quantity</TableCell>
                                            <TableCell align='center' sx={{ padding: 1 }}>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Map through order items here */}
                                        {
                                            order?.order_items && order.order_items.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell sx={{ padding: 1 }}>{item.meal_title}</TableCell>
                                                    <TableCell align='center' sx={{ padding: 1 }}>{item.quantity}</TableCell>
                                                    <TableCell align='center' sx={{ padding: 1 }}>{item.total_price}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Orders