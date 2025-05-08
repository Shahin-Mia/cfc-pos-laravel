import React, { useState, ChangeEvent, FormEvent, useEffect, SyntheticEvent } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ChevronLeft } from '@mui/icons-material';

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    name: string;
}

interface ProductAddProps {
    categories: Category[];
    subCategories: SubCategory[];
    units: Unit[];
    product: any;
    production: any;
    flash: any;
}

interface FormData {
    title: string;
    model?: string;
    barcode?: string;
    category: string;
    sub_category: string;
    purchase_unit: string;
    purchase_price: string;
    sale_unit?: string;
    sale_price?: string;
    conversion_rate?: string;
    opening_stock: string;
    alert_quantity: string;
    availability: string;
    description: string;
    // image: File | null;
}

function ProductForm({
    categories,
    subCategories,
    units,
    product,
    production,
    flash
}: ProductAddProps) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        // model: '',
        // barcode: '',
        category: '',
        sub_category: '',
        purchase_unit: '',
        purchase_price: '',
        // sale_unit: '',
        // sale_price: '',
        // conversion_rate: '',
        opening_stock: '',
        alert_quantity: '',
        availability: '1',
        description: '',
        // image: null,
    });


    useEffect(() => {
        if (production) {
            const keys = Object.keys(data);
            keys.forEach((key: any) => {
                switch (key) {
                    case "title":
                        setData(key, production["title"]);
                        break;
                    case "purchase_unit":
                        setData(key, production["unit_id"]);
                        break;
                    case "purchase_price":
                        setData(key, production["price"]);
                        break;
                    // case "sale_unit":
                    //     setData(key, production["unit_id"]);
                    //     break;
                    // case "sale_price":
                    //     setData(key, production["price"]);
                    //     break;
                    // case "conversion_rate":
                    //     setData(key, 1);
                    //     break;
                    case "opening_stock":
                        setData(key, production["quantity"]);
                        break;
                    case "description":
                        setData(key, production["description"]);
                        break;
                }
            })
        }
        if (product) {
            const keys = Object.keys(data);
            keys.forEach((key: any) => {
                switch (key) {
                    // case "model":
                    //     setData(key, product["model_no"]);
                    //     break;
                    case "category":
                        setData(key, product["category_id"]);
                        break;
                    case "sub_category":
                        setData(key, product["sub_category_id"]);
                        break;
                    case "purchase_unit":
                        setData(key, product.stock["purchase_unit_id"]);
                        break;
                    case "purchase_price":
                        setData(key, product.stock[key]);
                        break;
                    // case "sale_unit":
                    //     setData(key, product.stock["sale_unit_id"]);
                    //     break;
                    // case "sale_price":
                    //     setData(key, product.stock[key]);
                    //     break;
                    // case "conversion_rate":
                    //     setData(key, product.stock[key]);
                    //     break;
                    case "opening_stock":
                        setData(key, product.stock[key]);
                        break;
                    case "alert_quantity":
                        setData(key, product.stock[key]);
                        break;
                    case "availability":
                        setData(key, product["is_available"]);
                        break;
                    // case "image":
                    //     setData(key, null);
                    //     break;
                    default:
                        setData(key, product[key]);
                }
            })
        }

        if (flash.success || flash.error) {
            console.log(flash);
            setOpenSnackbar(true);
        }
    }, [flash, product]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (product) {
            post(route("products.update", product.id));
        } else if (production) {
            post(route("products.store", {
                production_id: production.id
            }));
        } else {
            post(route("products.store"));
        }
    };

    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setData('image', e.target.files[0]);
    //     }
    // };

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <DashboardLayout>
            <Head title={product ? "Edit product" : "Add product"} />
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
            <Box>
                <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                        {product ? "Edit Product" : "Product Add"}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => window.history.back()}
                        startIcon={<ChevronLeft />}
                    >
                        Go Back
                    </Button>
                </Grid>

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <TextField
                                        label="Title*"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        fullWidth
                                        required
                                        error={!!errors.title}
                                        helperText={errors.title}
                                        size="small"
                                    />
                                </Grid>
                                {/* <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Model/SL No"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Barcode"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid> */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            label="Category"
                                        >
                                            <MenuItem value="">Choose</MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Sub-Category</InputLabel>
                                        <Select
                                            value={data.sub_category}
                                            onChange={(e) => setData('sub_category', e.target.value)}
                                            label="Sub-Category"
                                        >
                                            {subCategories.map((subCat) => (
                                                <MenuItem key={subCat.id} value={subCat.id}>{subCat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Purchase Unit*</InputLabel>
                                        <Select
                                            value={data.purchase_unit}
                                            onChange={(e) => setData('purchase_unit', e.target.value)}
                                            required
                                            label="Purchase Unit*"
                                        >
                                            <MenuItem value="">Choose</MenuItem>
                                            {units.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Purchase Price*"
                                        value={data.purchase_price}
                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                        fullWidth
                                        type="number"
                                        size="small"
                                        required
                                    />
                                </Grid>
                                {/* <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Sale Unit*</InputLabel>
                                        <Select
                                            value={data.sale_unit}
                                            onChange={(e) => setData('sale_unit', e.target.value)}
                                            required
                                            label="Sale Unit*"
                                        >
                                            <MenuItem value="">Choose</MenuItem>
                                            {units.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Sale Price*"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        fullWidth
                                        type="number"
                                        size="small"
                                        required
                                        error={!!errors.sale_price}
                                        helperText={errors.sale_price}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Conversion Rate*"
                                        value={data.conversion_rate}
                                        onChange={(e) => setData('conversion_rate', e.target.value)}
                                        fullWidth
                                        type="number"
                                        size="small"
                                        required
                                        error={!!errors.conversion_rate}
                                        helperText={errors.conversion_rate}
                                    />
                                </Grid> */}
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Opening Stock*"
                                        value={data.opening_stock}
                                        onChange={(e) => setData('opening_stock', e.target.value)}
                                        fullWidth
                                        type="number"
                                        size="small"
                                        required
                                        error={!!errors.opening_stock}
                                        helperText={errors.opening_stock}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Alert Quantity"
                                        value={data.alert_quantity}
                                        onChange={(e) => setData('alert_quantity', e.target.value)}
                                        fullWidth
                                        type="number"
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Availability</InputLabel>
                                        <Select
                                            value={data.availability}
                                            onChange={(e) => setData('availability', e.target.value)}
                                            label="Availability"
                                        >
                                            <MenuItem value="1">Available</MenuItem>
                                            <MenuItem value="0">Not-Available</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                    />
                                </Grid>

                                {/* <Grid size={{ xs: 12, md: 6 }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                    >
                                        Upload Image*
                                        <input
                                            type="file"
                                            name="image"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {errors.image && <Typography color="error" variant="caption">{errors.image}</Typography>}
                                </Grid> */}

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={processing}
                                        fullWidth
                                    >
                                        {processing ? product ?
                                            'Updating...' :
                                            'Adding...' :
                                            product ?
                                                'Update Product' :
                                                'Add Product'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
}

export default ProductForm;
