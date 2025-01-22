import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { ChevronLeft } from "@mui/icons-material"
import { Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([]);
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
                                        <TableCell align='center' sx={{ padding: 1 }}>Payment</TableCell>
                                        <TableCell align='center' sx={{ padding: 1 }}>Method</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        orders.map((item: any) => (
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

                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Orders