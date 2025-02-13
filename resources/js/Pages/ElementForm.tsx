import React, { useState, FormEvent, useEffect, SyntheticEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    SnackbarCloseReason,
    Snackbar,
    Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardLayout from "@/Layouts/DashboardLayout";

interface Stock {
    purchase_price: number;
    opening_stock: number;
    stock: number;
    alert_quantity: number;
    purchase_unit_id: number;
    purchaseUnit: {
        name: string;
    };
}

interface ElementType {
    id: number;
    title: string;
    description: string;
    stock: Stock;
}

interface Unit {
    id: number;
    name: string;
}

interface ElementProps {
    element: ElementType,
    units: Unit[];
    flash: any;
}

const ElementForm: React.FC<ElementProps> = ({ element, units, flash }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { data, setData, post, put, processing, errors } = useForm({
        title: "",
        description: "",
        purchase_unit_id: "",
        purchase_price: "",
        opening_stock: "",
        alert_quantity: "",
        ...(element && { stock: "" })
    });

    useEffect(() => {
        if (element) {
            const keys = Object.keys(data);
            keys.forEach((key: any) => {
                switch (key) {
                    case "purchase_unit_id":
                        setData(key, element.stock.purchase_unit_id);
                        break;
                    case "purchase_price":
                        setData(key, element.stock.purchase_price);
                        break;
                    case "opening_stock":
                        setData(key, element.stock.opening_stock);
                        break;
                    case "alert_quantity":
                        setData(key, element.stock.alert_quantity);
                        break;
                    case "stock":
                        setData(key, element.stock.stock);
                        break;
                    default:
                        setData(key, element[key as keyof ElementType])
                }
            })
        }

        if (flash.success || flash.error) {
            console.log(flash);
            setOpenSnackbar(true);
        }
    }, [flash, element]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (element) {
            put(route("elements.update", element.id));
        } else {
            post(route("elements.store"));
        }
    };

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <DashboardLayout>
            <Head title={element ? "Edit Element" : "Add Element"} />
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert
                    onClose={handleClose}
                    severity={flash.success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {flash.success ? flash.success : flash.error}
                </Alert>
            </Snackbar>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Add Element</Typography>
                <Button variant="contained" color="secondary" href={route("elements.index")}>Go Back</Button>
            </Box>

            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Title*"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    fullWidth
                                    required
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    size="small"
                                    error={!!errors.description}
                                    helperText={errors.description}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small" error={!!errors.purchase_unit_id}>
                                    <InputLabel>Purchase Unit*</InputLabel>
                                    <Select
                                        value={data.purchase_unit_id}
                                        onChange={(e) => setData("purchase_unit_id", e.target.value)}
                                        label="Purchase Unit*"
                                    >
                                        {units.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Purchase Price*"
                                    type="number"
                                    value={data.purchase_price}
                                    onChange={(e) => setData("purchase_price", e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                    error={!!errors.purchase_price}
                                    helperText={errors.purchase_price}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Initial Stock*"
                                    type="number"
                                    value={data.opening_stock}
                                    onChange={(e) => setData("opening_stock", e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                    error={!!errors.opening_stock}
                                    helperText={errors.opening_stock}
                                />
                            </Grid>
                            {
                                element &&
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Stock*"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData("stock", e.target.value)}
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.stock}
                                        helperText={errors.stock}
                                    />
                                </Grid>
                            }
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Alert Quantity"
                                    type="number"
                                    value={data.alert_quantity}
                                    onChange={(e) => setData("alert_quantity", e.target.value)}
                                    fullWidth
                                    size="small"
                                    error={!!errors.alert_quantity}
                                    helperText={errors.alert_quantity}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    disabled={processing}
                                >
                                    {
                                        processing ?
                                            <CircularProgress size={24} /> :
                                            element ? "Update Element" :
                                                "Add Element"
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default ElementForm;
