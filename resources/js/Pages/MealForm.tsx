import React, { SyntheticEvent, useEffect, useState } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "@/Layouts/DashboardLayout";


const MealForm: React.FC<any> = ({ mealCategories, products, meal, flash }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [d_products, setDProducts] = useState<any>([]);
    const { data, setData, post, put, processing, errors } = useForm({
        title: "",
        description: "",
        meal_category_id: "",
        purchase_price: "",
        sale_price: "",
        image: null,
        is_available: "",
        products_selected: [] as any,
        ...(meal && { deleted_products: [] as any })
    });

    useEffect(() => {
        // if (meal) {
        //     const keys = Object.keys(data);
        //     keys.forEach((key: any) => {
        //         switch (key) {
        //             case "elements_selected":
        //                 let selectedElements: any = [];
        //                 meal.production_elements.forEach((item: any) => {
        //                     let modItem = {
        //                         ...item.element,
        //                         ...item,
        //                         total_price: item.price,
        //                         production_element_id: item.id
        //                     }
        //                     selectedElements.push(modItem);
        //                 });
        //                 setData(key, selectedElements);
        //                 break;
        //             case "production_price":
        //                 setData(key, meal["price"]);
        //                 break;
        //             default:
        //                 setData(key, meal[key]);
        //         }
        //     });
        // }
        if (flash.success || flash.error) {
            console.log(flash);
            setOpenSnackbar(true);
        }
    }, [flash])

    const [elementSearch, setElementSearch] = useState("");
    const [filteredElements, setFilteredElements] = useState<any>([]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setElementSearch(e.target.value);
            setFilteredElements(
                products.filter((el: any) =>
                    el.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        } else {
            setElementSearch("");
            setFilteredElements([]);
        }
    };

    const addElement = (element: any) => {
        if (!data.elements_selected.some((el: any) => el.id === element.id)) {
            setData("elements_selected", [
                ...data.elements_selected,
                { ...element, quantity: 1, total_price: element.stock.purchase_price },
            ]);
        }
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updatedElements = [...data.elements_selected];
        updatedElements[index].quantity = quantity;
        updatedElements[index].total_price =
            quantity * updatedElements[index].stock.purchase_price;
        setData("elements_selected", updatedElements);
    };

    const deleteElement = (index: number) => {
        const dElement = data.elements_selected.find((_: any, i: number) => i === index);

        if (meal && dElement) {
            const isExistingElement = meal.production_elements.some(
                (item: any) => item.id === dElement.id
            );

            if (isExistingElement) {
                setDProducts((prev: any) => {
                    const updatedElements = [...prev, dElement];
                    setData("deleted_elements", updatedElements);
                    return updatedElements;
                });
            }
        }

        setData(
            "elements_selected",
            data.elements_selected.filter((_: any, i: number) => i !== index)
        );
    };


    const calculateProduction = () => {
        const totalPrice = data.elements_selected.reduce(
            (sum: any, el: any) => sum + el.total_price,
            0
        );
        setData("production_price", totalPrice.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalPrice = data.elements_selected.reduce(
            (sum: any, el: any) => sum + el.total_price,
            0
        );
        if (totalPrice === Number(data.production_price)) {
            if (meal) {
                put(route("productions.update", meal.id));
            } else {
                post(route("productions.store"));
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

    return (
        <DashboardLayout>
            <Head title="Production" />
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
                            "Production Edit" :
                            "Production Create"
                    }
                </Typography>
                <Button variant="contained" size="small" color="secondary" component={Link} href={route("productions.index")}>Go Back</Button>
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
                                    label="Search Element"
                                    value={elementSearch}
                                    onChange={handleSearchChange}
                                    fullWidth
                                    placeholder="Enter element title..."
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                {filteredElements.length > 0 && (
                                    <List dense>
                                        {filteredElements.map((element: any) => (
                                            <ListItem
                                                key={element.id}
                                                onClick={() => addElement(element)}
                                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#eee" } }}
                                            >
                                                <ListItemText>
                                                    {element.title} (Price: {element.stock.purchase_price})
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Current Stock</TableCell>
                                            <TableCell>Stock Price</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.elements_selected.map((element: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{element.title}</TableCell>
                                                <TableCell>{element.stock.stock}</TableCell>
                                                <TableCell>{element.stock.purchase_price}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={element.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(index, Number(e.target.value))
                                                        }
                                                        size="small"
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>{element.total_price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => deleteElement(index)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ width: "100%", display: 'flex', justifyContent: "end" }}>
                                    {
                                        data.elements_selected.length > 0 && (
                                            <Button
                                                onClick={calculateProduction}
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 2 }}
                                            >
                                                Calculate
                                            </Button>
                                        )
                                    }
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Unit*</InputLabel>
                                    <Select
                                        value={data.unit_id}
                                        onChange={(e) => setData("unit_id", e.target.value)}
                                        label="Unit*"
                                    >
                                        <MenuItem value="">Choose</MenuItem>
                                        {mealCategories.map((unit: any) => (
                                            <MenuItem key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Production Price"
                                    type="number"
                                    value={data.production_price}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Button type="submit" variant="contained" color="primary" disabled={processing} fullWidth>
                                    {
                                        processing ?
                                            <CircularProgress size={24} /> :
                                            meal ?
                                                "Update Production" :
                                                "Create Production"
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
