import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';

export default function Dashboard({ yesterdaySales }: any) {
    const getYesterdayDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };
    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3, marginY: 3 }}>
                <Typography variant='h5' sx={{ marginBottom: 1 }}>
                    Dashboard
                </Typography>
                <Typography variant='body1' sx={{ marginBottom: 1 }}>
                    Welcome to the dashboard! Here you can manage your orders, products, and more.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant='button' sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1 }}>
                                Yesterday's Sales
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{getYesterdayDate()}</Typography>
                            <Typography variant="h5">
                                Sales: <span style={{ color: 'green' }}>{yesterdaySales} RM</span>
                            </Typography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Stack>
            </Box>
        </DashboardLayout>
    );
}
