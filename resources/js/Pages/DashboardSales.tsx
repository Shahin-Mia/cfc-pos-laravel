import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react"
import { Box, Button, Card, CardActionArea, CardContent, Container, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/en-gb';
import 'dayjs/locale/de';

interface DataTypes {
    from_date: null | Dayjs,
    to_date: null | Dayjs
}

interface Props {
    sales: any[];
    totalSale: string;
    netSalePrice: number;
    taxCollection: number;
    previousMonthSale: number;
}
function DashboardSales({
    sales,
    totalSale,
    netSalePrice,
    taxCollection,
    previousMonthSale
}: Props) {
    const { data, setData, post, processing, errors } = useForm<DataTypes>({
        from_date: null,
        to_date: null,
    });

    const handleSearch = (event: any) => {
        event.preventDefault();
        const dates = {
            from_date: data.from_date?.format("YYYY-MM-DD"),
            to_date: data.to_date?.format("YYYY-MM-DD")
        }
        post(route("dashboard.salesByDate"));
    }
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
                                        RM {previousMonthSale}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider />
                            <Box>
                                <Box component='form' sx={{ my: 2 }} onSubmit={handleSearch}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                        <Stack direction='row' spacing={2} sx={{ alignItems: "baseline" }}>
                                            <DatePicker
                                                label="From Date"
                                                value={data.from_date}
                                                format="DD/MM/YYYY"
                                                onChange={(newValue) => setData('from_date', newValue)}
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors.from_date,
                                                        helperText: errors.from_date,
                                                    },
                                                }}
                                            />
                                            <DatePicker
                                                label="To Date"
                                                format="DD/MM/YYYY"
                                                value={data.to_date}
                                                onChange={(newValue) => setData('to_date', newValue)}
                                                minDate={dayjs(data.from_date)}
                                                disabled={data.from_date === null}
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors.to_date,
                                                        helperText: errors.to_date,
                                                    },
                                                }}
                                            />
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    loading={processing}

                                                >
                                                    Search
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </LocalizationProvider>
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
                                                <TableRow key={index}>
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