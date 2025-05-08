import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircleOutline } from '@mui/icons-material';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

function OrderComplete({ order }: any) {
    return (
        <AuthenticatedLayout>
            <Head title="Order Complete" />
            <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper sx={{ display: "flex", flexDirection: "column", width: "50vw", alignItems: "center", padding: 3, margin: 3 }}>
                    <CheckCircleOutline sx={{ fontSize: 60, color: "#ff5f01", fontWeight: "400", marginBottom: 1 }} />
                    <Typography variant='h5' sx={{ marginBottom: 1 }}>
                        Order Completed
                    </Typography>
                    <Typography variant='body1'>Order ID: {order.id}</Typography>
                    <Typography variant='body1'>Total Amount: {order.total_price}RM</Typography>
                    <Typography variant='body1'>Payment Method: {order.payment_method}</Typography>
                    <Stack direction="row" spacing={3} mt={2}>
                        <Button
                            variant="outlined"
                            component={Link}
                            href={route("home")}
                            endIcon={<ArrowRight />}
                        >
                            Continue
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    )
}

export default OrderComplete