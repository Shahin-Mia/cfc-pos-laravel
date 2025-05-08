import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react"
import { Box, Card, CardActionArea, CardContent, Container, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"

interface Props {
    sales: any[];
    totalSale: string;
    netSalePrice: number;
    taxCollection: number;
}
function DashboardSales({
    sales,
    totalSale,
    netSalePrice,
    taxCollection
}: Props) {
    console.log(sales);
    return (
        <DashboardLayout>
            <Head title="Sales" />
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, }}>
                    <Card>
                        <CardContent>
                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-around', mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="button">
                                            Current Month Sales
                                        </Typography>
                                        <Typography variant="h4" color="primary">
                                            RM {totalSale}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Stack direction="row">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Current Month Net Sale
                                                </Typography>
                                                <Typography variant="h5" color="primary">
                                                    RM {netSalePrice}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Current Month Tax Collection
                                                </Typography>
                                                <Typography variant="h5" color="primary">
                                                    RM {taxCollection}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="button">
                                        Previous Month Sales
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        RM {totalSale}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider />
                            <Box>
                                <Box component='form'>
                                    <Stack direction='row'>
                                        <TextField
                                            label="From Date"
                                            variant="outlined"
                                            size="small"
                                            type="date"
                                            margin="normal"
                                        />
                                    </Stack>
                                </Box>
                                <TableContainer sx={{ overflowY: 'auto', maxHeight: 300 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Meal Title</TableCell>
                                                <TableCell>Sale Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sales.map((sale: any, index: any) => (
                                                <TableRow key={sale.id}>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>{sale.meal_title}</TableCell>
                                                    <TableCell>
                                                        {Number(sale.total_gross_sales).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {sale.total_quantity}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </DashboardLayout>
    )
}
export default DashboardSales