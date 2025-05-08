import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
import { Box, Card, CardActionArea, CardContent, Container, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

interface Props {
    sales: any[];
    totalSale: string;
    closing_balance: number;
    opening_balance: number;
}
function Sales({
    sales,
    totalSale,
    closing_balance,
    opening_balance
}: Props) {
    console.log(sales);
    return (
        <AuthenticatedLayout>
            <Head title="Sales" />
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, }}>
                    <Card>
                        <CardContent>
                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-around', mb: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="button">
                                        Todays Sales
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        RM {totalSale}
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant="button">
                                        {
                                            opening_balance ? "Opening Balance" : "Closing Balance"
                                        }
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        RM {opening_balance ? opening_balance : closing_balance}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider />
                            <Box>
                                <TableContainer sx={{ overflowY: 'auto', maxHeight: 300 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Meal Title</TableCell>
                                                <TableCell>Sale Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>Order Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sales.map((sale: any, index: any) => (
                                                <TableRow key={sale.id}>
                                                    <TableCell>
                                                        {sale.order_id}
                                                    </TableCell>
                                                    <TableCell>{sale.meal_title}</TableCell>
                                                    <TableCell>
                                                        {Number(sale.gross_sale_price).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {sale.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            sale.discount_percentage ?
                                                                Number(sale.discount_percentage) :
                                                                0
                                                        } %
                                                    </TableCell>
                                                    <TableCell>
                                                        {sale.order_date}
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
        </AuthenticatedLayout>
    )
}
export default Sales