import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "@/Layouts/DashboardLayout";


const ProductionCreate: React.FC<any> = ({ units, elements }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        unit_id: "",
        quantity: "",
        production_price: "",
        elements_selected: [] as any,
    });

    const [elementSearch, setElementSearch] = useState("");
    const [filteredElements, setFilteredElements] = useState<any>([]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setElementSearch(e.target.value);
            setFilteredElements(
                elements.filter((el: any) =>
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
        post(route("productions.store"));
    };

    return (
        <DashboardLayout>
            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Production Create
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
                                <Select
                                    value={data.unit_id}
                                    onChange={(e) => setData("unit_id", e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    sx={{ mt: 2 }}
                                    size="small"
                                >
                                    <MenuItem value="">Select Unit</MenuItem>
                                    {units.map((unit: any) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData("quantity", e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Production Price"
                                    type="number"
                                    value={data.production_price}
                                    fullWidth
                                    margin="normal"
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
                                    {processing ? <CircularProgress size={24} /> : "Create Production"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default ProductionCreate;
