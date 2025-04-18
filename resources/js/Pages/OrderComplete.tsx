import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react';
import { CheckCircleOutline } from '@mui/icons-material';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';

function OrderComplete() {
    return (
        <AuthenticatedLayout>
            <Head title="Order Complete" />
            <Container>
                <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3, margin: 3 }}>
                    <CheckCircleOutline sx={{ fontSize: 60, color: "#ff5f01", fontWeight: "400", marginBottom: 1 }} />
                    <Typography variant='h5' sx={{ marginBottom: 1 }}>
                        Order Completed
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Button variant="outlined" component={Link} href={route("print.receipt")}>Print Receipt</Button>
                        <Button variant="outlined" component={Link} href={route("home")}>Continue</Button>
                    </Stack>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    )
}

export default OrderComplete