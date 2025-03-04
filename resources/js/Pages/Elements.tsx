import React, { SyntheticEvent, useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Snackbar,
    SnackbarCloseReason,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import DashboardLayout from "@/Layouts/DashboardLayout";

interface Stock {
    purchase_price: number;
    opening_stock: number;
    stock: number;
    alert_quantity: number;
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

interface Props {
    elements: {
        data: ElementType[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    flash: any;
}

const ElementsPage: React.FC<Props> = ({ elements, flash }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
    const [isStockModalOpen, setStockModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setOpenSnackbar(true);
        }
    }, [flash]);

    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearch(event.target.value);
    //     Inertia.get(route("elements.index"), { search: event.target.value }, { preserveState: true });
    // };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedElementId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        if (selectedElementId) {
            router.get(route("elements.edit", selectedElementId));
        }
        handleMenuClose();
    };

    const handleAddStock = () => {
        setStockModalOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedElementId && confirm("Are you sure you want to delete this element?")) {
            router.delete(route("elements.destroy", selectedElementId));
        }
        handleMenuClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        router.get(route("elements.index"), { page }, { preserveState: true });
    };
    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <DashboardLayout>
            <Head title="Add Element" />
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
                {/* Title and Add Button */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Elements</Typography>
                    <Link href={route("elements.create")}>
                        <Button variant="contained" color="primary" size="small">
                            Add Element
                        </Button>
                    </Link>
                </Box>

                {/* Search */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter element title..."
                            value={search}
                        // onChange={handleSearchChange}
                        // InputProps={{
                        //     startAdornment: (
                        //         <SearchIcon sx={{ mr: 1, color: "gray" }} />
                        //     ),
                        // }}
                        />
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell size="small">Title</TableCell>
                                        <TableCell size="small">Category</TableCell>
                                        <TableCell size="small">Unit <br />P.Price</TableCell>
                                        <TableCell size="small">Opening <br />Stock</TableCell>
                                        <TableCell size="small">Current <br />Stock</TableCell>
                                        <TableCell size="small">Price</TableCell>
                                        <TableCell size="small">Alert<br /> Qty</TableCell>
                                        <TableCell size="small">Description</TableCell>
                                        <TableCell size="small">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {elements.data.map((element: any, index: any) => (
                                        <TableRow key={element.id}>
                                            <TableCell>{elements.per_page * (elements.current_page - 1) + index + 1}</TableCell>
                                            <TableCell>{element.title}</TableCell>
                                            <TableCell>{element.element_category.name}</TableCell>
                                            <TableCell>
                                                {element.stock.purchase_price.toFixed(2)} |{" "}
                                                <Typography variant="caption">{element.stock.purchase_unit.name}</Typography>
                                            </TableCell>
                                            <TableCell>{element.stock.opening_stock}</TableCell>
                                            <TableCell>{element.stock.stock}</TableCell>
                                            <TableCell>
                                                {(element.stock.purchase_price * element.stock.stock).toFixed(2)}
                                            </TableCell>
                                            <TableCell>{element.stock.alert_quantity}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    rows={1}
                                                    value={element.description}
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) => handleMenuClick(event, element.id)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl && selectedElementId === element.id)}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem onClick={handleEdit}>View/Edit</MenuItem>
                                                    {/* <MenuItem onClick={handleAddStock}>Add Stock</MenuItem> */}
                                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box mt={2} display="flex" justifyContent="center">
                            <Pagination
                                count={elements.last_page}
                                page={elements.current_page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Add Stock Modal */}
                <Dialog open={isStockModalOpen} onClose={() => setStockModalOpen(false)}>
                    <DialogTitle>Add Stock</DialogTitle>
                    <DialogContent>
                        <Typography>Stock form goes here...</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setStockModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
};

export default ElementsPage;
