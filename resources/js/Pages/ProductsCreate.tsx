import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    TextareaAutosize,
    InputLabel,
    FormControl,
} from "@mui/material";
import DashboardLayout from "@/Layouts/DashboardLayout";


const ProductsCreate: React.FC<any> = ({
    categories,
    units,
    flash,
}) => {
    const [subCategories, setSubCategories] = useState<any>([]);
    const { data, setData, post, processing } = useForm({
        title: "",
        model: "",
        barcode: "",
        category: "",
        sub_category: "",
        purchase_unit: "",
        purchase_price: 0,
        sale_unit: "",
        sale_price: 0,
        conversion_rate: 1,
        opening_stock: 0,
        alert_quantity: "",
        availability: "1",
        description: "",
        image: null as File | null,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post("/product/create");
    };

    const handleCategoryChange = (event: any) => {
        setData("category", event.target.value);

        const subCategories = categories.filter((category: any) => category.category_id === parseInt(event.target.value));
        setSubCategories(subCategories);
    }

    return (
        <DashboardLayout>
            <Head title="Products" />
            <Box>
                {/* {flash.failed && <div className="alert alert-danger">{flash.failed}</div>}
                {flash.success && <div className="alert alert-success">{flash.success}</div>} */}

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5">Product Add</Typography>
                    <Button variant="outlined" component={Link} href={route("products.index")}>
                        Go Back
                    </Button>
                </Box>

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Title*"
                                    size="small"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    required
                                />
                            </Box>

                            <Box display="flex" gap={2} mb={3}>
                                <TextField
                                    fullWidth
                                    label="Model/SL No"
                                    size="small"
                                    value={data.model}
                                    onChange={(e) => setData("model", e.target.value)}
                                />

                                <TextField
                                    fullWidth
                                    label="Barcode"
                                    size="small"
                                    value={data.barcode}
                                    onChange={(e) => setData("barcode", e.target.value)}
                                />
                            </Box>

                            <Box display="flex" gap={2} mb={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={data.category}
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map((cat: any) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                    <InputLabel>Sub-Category</InputLabel>
                                    <Select
                                        value={data.sub_category}
                                        onChange={(e) => setData("sub_category", e.target.value)}
                                    >
                                        {subCategories?.map((sub: any) => (
                                            <MenuItem key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box display="flex" gap={2} mb={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Purchase Unit*</InputLabel>
                                    <Select
                                        value={data.purchase_unit}
                                        onChange={(e) => setData("purchase_unit", e.target.value)}
                                        required
                                    >
                                        {units.map((unit: any) => (
                                            <MenuItem key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Purchase Price*"
                                    size="small"
                                    type="number"
                                    value={data.purchase_price}
                                    onChange={(e) => setData("purchase_price", parseFloat(e.target.value))}
                                />

                                <FormControl fullWidth size="small">
                                    <InputLabel>Sale Unit*</InputLabel>
                                    <Select
                                        value={data.sale_unit}
                                        onChange={(e) => setData("sale_unit", e.target.value)}
                                        required
                                    >
                                        {units.map((unit: any) => (
                                            <MenuItem key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Sale Price*"
                                    size="small"
                                    type="number"
                                    value={data.sale_price}
                                    onChange={(e) => setData("sale_price", parseFloat(e.target.value))}
                                    required
                                />
                            </Box>

                            <Box display="flex" gap={2} mb={3}>
                                <TextField
                                    fullWidth
                                    label="Conversion Rate*"
                                    size="small"
                                    type="number"
                                    value={data.conversion_rate}
                                    onChange={(e) => setData("conversion_rate", parseFloat(e.target.value))}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Opening Stock*"
                                    size="small"
                                    type="number"
                                    value={data.opening_stock}
                                    onChange={(e) => setData("opening_stock", parseFloat(e.target.value))}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Alert Quantity"
                                    size="small"
                                    type="number"
                                    value={data.alert_quantity || ""}
                                    onChange={(e) => setData("alert_quantity", e.target.value)}
                                />

                                <FormControl fullWidth size="small">
                                    <InputLabel>Availability</InputLabel>
                                    <Select
                                        value={data.availability}
                                        onChange={(e) => setData("availability", e.target.value)}
                                    >
                                        <MenuItem value="1">Available</MenuItem>
                                        <MenuItem value="0">Not Available</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mb={3}>
                                <TextareaAutosize
                                    placeholder="Description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    minRows={3}
                                    style={{ width: "100%", padding: "8px", fontSize: "14px" }}
                                />
                            </Box>

                            <Box mb={3}>
                                <Typography variant="subtitle1">Image*</Typography>
                                <input
                                    type="file"
                                    onChange={(e) => setData("image", e.target.files ? e.target.files[0] : null)}
                                    required
                                />
                            </Box>

                            <Box display="flex" justifyContent="flex-end" mt={4}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                >
                                    {processing ? <CircularProgress size={24} /> : "Add Product"}
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default ProductsCreate;
