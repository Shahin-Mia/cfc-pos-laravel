import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Box,
    List,
    ListItemText,
    ListItem,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
    SnackbarCloseReason,
    Popover,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { VisuallyHiddenInput } from "@/Components/VisuallyHiddenInput";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Add, ChevronLeft } from "@mui/icons-material";

interface Varient {
    name: string,
    extra_price: number
}

interface FormData {
    title: string,
    description: string,
    sale_unit_id: number,
    meal_category_id: number,
    purchase_price: number,
    sale_price: number | string,
    image: File | null,
    is_available: number,
    products_selected: any[],
    deleted_products: any[],
    varient_available: number,
    varients: Varient[],
}

const MealForm: React.FC<any> = ({ mealCategories, units, products, meal, flash }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [d_products, setDProducts] = useState<any>([]);
    const [productSearch, setProductSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<any>([]);
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: "",
        description: "",
        sale_unit_id: 0,
        meal_category_id: 0,
        purchase_price: 0,
        sale_price: "",
        image: null,
        is_available: 0,
        products_selected: [],
        deleted_products: [],
        varient_available: 0,
        varients: [],
    });

    useEffect(() => {
        if (meal) {
            const keys = Object.keys(data);
            keys.forEach((key: any) => {
                switch (key) {
                    case "products_selected":
                        let selectedProducts: any = [];
                        meal.meal_products.forEach((item: any) => {
                            let modItem = {
                                title: item.product.title,
                                stock: item.product.stock,
                                quantity: item.quantity,
                                total_price: item.price,
                                meal_product_id: item.id,
                                id: item.product_id
                            }
                            selectedProducts.push(modItem);
                        });
                        setData(key, selectedProducts);
                        break;
                    default:
                        setData(key, meal[key]);
                }
            });
        }
        if (flash.success || flash.error) {
            setOpenSnackbar(true);
        }
    }, [flash]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setProductSearch(e.target.value);
            setFilteredProducts(
                products.filter((el: any) =>
                    el.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        } else {
            setProductSearch("");
            setFilteredProducts([]);
        }
    };

    const addProduct = (product: any) => {
        if (!data.products_selected.some((el: any) => el.id === product.id)) {
            setData("products_selected", [
                ...data.products_selected,
                { ...product, quantity: 1, total_price: product.stock.purchase_price },
            ]);
        }
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updatedElements = [...data.products_selected];
        updatedElements[index].quantity = quantity;
        updatedElements[index].total_price =
            quantity * updatedElements[index].stock.purchase_price;
        setData("products_selected", updatedElements);
    };

    const deleteElement = (index: number) => {
        const dElement = data.products_selected.find((_: any, i: number) => i === index);
        if (meal && dElement) {
            const isExistingElement = meal.meal_products.some(
                (item: any) => item.id === dElement.meal_product_id
            );

            if (isExistingElement) {
                setDProducts((prev: any) => {
                    const updatedElements = [...prev, dElement];
                    setData("deleted_products", updatedElements);
                    return updatedElements;
                });

            }
        }
        const products = data.products_selected.filter((_: any, i: number) => i !== index);
        setData("products_selected", products);
    };

    const calculateProduction = () => {
        const totalPrice = data.products_selected.reduce(
            (sum: any, el: any) => sum + el.total_price,
            0
        );
        setData("purchase_price", totalPrice.toString());
    };

    const totalPrice = useMemo(calculateProduction, [data.products_selected]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalPrice = data.products_selected.reduce(
            (sum: any, el: any) => sum + el.total_price,
            0
        );
        if (totalPrice === Number(data.purchase_price)) {
            if (meal) {
                post(route("meals.update", meal.id));
            } else {
                post(route("meals.store"));
            }
        } else {
            flash.error = "Calculate meal cost!";
            setOpenSnackbar(true);
        }
    };
    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleSearchClose = () => {
        setProductSearch("");
        setFilteredProducts([])
    }

    const addVarient = () => {
        const newVarient = {
            name: "",
            extra_price: 0,
        };
        const updatedVarients = [...data.varients];
        updatedVarients.push(newVarient);
        setData("varients", updatedVarients);
    };


    const handleOnChange = (e: any, index: number, field: any) => {
        const updatedVarients = [...data.varients];
        if (field === "name") {
            updatedVarients[index].name = e.target.value;
        } else if (field === "extra_price") {
            updatedVarients[index].extra_price = Number(e.target.value);
        }
        setData("varients", updatedVarients);
    }

    const deleteVarient = (index: number) => {
        const updatedVarients = [...data.varients];
        updatedVarients.splice(index, 1);
        setData("varients", updatedVarients);
    }

    return (
        <DashboardLayout>
            <Head title="Meal" />
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
            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    {
                        meal ?
                            "Meal Edit" :
                            "Meal Create"
                    }
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
                        <Grid container size={{ xs: 12 }} spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Title"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Search Products"
                                    value={productSearch}
                                    onChange={handleSearchChange}
                                    fullWidth
                                    placeholder="Enter element title..."
                                    size="small"
                                    type="search"
                                    id="productSearch"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Popover
                                    open={Boolean(filteredProducts.length)}
                                    anchorEl={document.querySelector("#productSearch")}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    onClose={handleSearchClose}
                                    disableAutoFocus
                                    disablePortal
                                >
                                    <List dense sx={{ width: 500, maxHeight: 230, overflowY: "auto" }}>
                                        {filteredProducts.map((product: any) => (
                                            <ListItem
                                                key={product.id}
                                                onClick={() => addProduct(product)}
                                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#eee" } }}
                                                secondaryAction={
                                                    <Typography variant="overline">Price: ${product.stock.purchase_price}</Typography>
                                                }
                                            >
                                                <ListItemText
                                                    primary={product.title}
                                                />

                                            </ListItem>
                                        ))}
                                    </List>
                                </Popover>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Unit</TableCell>
                                            <TableCell>Stock Price</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell width={150}>Price</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.products_selected.map((product: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{product.title}</TableCell>
                                                <TableCell>{product.stock.purchase_unit.name}</TableCell>
                                                <TableCell>{product.stock.purchase_price}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(index, Number(e.target.value))
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{product.total_price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => deleteElement(index)}
                                                    >
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Unit*</InputLabel>
                                    <Select
                                        value={data.sale_unit_id}
                                        onChange={(e) => setData("sale_unit_id", Number(e.target.value))}
                                        label="Unit*"
                                    >
                                        <MenuItem value="0">Choose</MenuItem>
                                        {units.map((unit: any) => (
                                            <MenuItem key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Categories*</InputLabel>
                                    <Select
                                        value={data.meal_category_id}
                                        onChange={(e) => setData("meal_category_id", Number(e.target.value))}
                                        label="Categories*"
                                    >
                                        <MenuItem value="0">Choose</MenuItem>
                                        {mealCategories.map((cat: any) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Purchase Price"
                                    type="number"
                                    value={data.purchase_price}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Sale Price"
                                    type="number"
                                    value={data.sale_price}
                                    onChange={(e) => setData("sale_price", e.target.value)}
                                    fullWidth
                                    size="small"
                                    sx={{
                                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                            display: "none",
                                        },
                                        MozAppearance: "textfield",
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Availability</InputLabel>
                                    <Select
                                        value={data.is_available}
                                        onChange={(e) => setData('is_available', Number(e.target.value))}
                                        label="Availability"
                                    >
                                        <MenuItem value="1">Available</MenuItem>
                                        <MenuItem value="0">Not-Available</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Varient availability</InputLabel>
                                    <Select
                                        value={data.varient_available}
                                        onChange={(e) => setData('varient_available', Number(e.target.value))}
                                        label="Varient availability"
                                    >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                >
                                    Upload Image*
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => {
                                            if (event.target.files && event.target.files[0]) {
                                                setData("image", event.target.files[0]);
                                            }
                                        }}
                                    />
                                </Button>
                                {errors.image && <Typography color="error" variant="caption">{errors.image}</Typography>}
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                {data.varient_available === 1 && (
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <span>#</span>
                                                    <Button size="small" onClick={addVarient}>
                                                        <Add />
                                                    </Button>
                                                </TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Extra Price</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.varients.map((varient: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={varient.name}
                                                            onChange={(e) => handleOnChange(e, index, "name")}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={varient.extra_price}
                                                            onChange={(e) => handleOnChange(e, index, "extra_price")}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => deleteVarient(index)}
                                                        >
                                                            <DeleteIcon color="error" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                >
                                    {
                                        processing ?
                                            <CircularProgress size={24} /> :
                                            meal ?
                                                "Update Meal" :
                                                "Create Meal"
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

export default MealForm;
