import React, { SyntheticEvent, useEffect, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Tooltip,
    Badge,
    SnackbarCloseReason,
    Snackbar,
    Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/Layouts/DashboardLayout";


const Products: React.FC<any> = ({ products, flash }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { delete: destroy, processing } = useForm();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuProductId, setMenuProductId] = React.useState<number | null>(null);

    useEffect(() => {
        if (flash.success || flash.error) {
            setOpenSnackbar(true);
        }
    }, [flash]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setMenuProductId(id);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuProductId(null);
    };

    const handleDelete = (id: number) => {
        destroy(route("products.destroy", id), {
            preserveScroll: true,
        });
        handleMenuClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        router.get(route("products.index"), { page }, { preserveState: true });
    };

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <DashboardLayout>
            <Head title="Products" />
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
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5">Products</Typography>
                <Link href={route("products.create")}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add Product
                    </Button>
                </Link>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>P.Price</TableCell>
                            {/* <TableCell>S.Price</TableCell> */}
                            <TableCell>StockQty</TableCell>
                            {/* <TableCell>Img</TableCell> */}
                            <TableCell>Description</TableCell>
                            {/* <TableCell>Serial</TableCell>
                            <TableCell>Barcode</TableCell> */}
                            <TableCell>Category</TableCell>
                            <TableCell align="center">Avail.</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.data.map((product: any, index: any) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {(products.current_page - 1) * products.per_page + index + 1}
                                </TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>
                                    {product.stock.purchase_price?.toFixed(2)}|
                                    {product.stock.purchase_unit?.name}
                                </TableCell>
                                {/* <TableCell>
                                    {product.stock.sale_price?.toFixed(2)}|
                                    {product.stock.sale_unit?.name}
                                </TableCell> */}
                                <TableCell>
                                    {product.stock.stock}|
                                    {product.stock.sale_unit.name}
                                </TableCell>
                                {/* <TableCell>
                                    <Tooltip title="View Image">
                                        <Avatar
                                            src={`/storage/${product.image.image}`}
                                            alt="Product Image"
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </Tooltip>
                                </TableCell> */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        noWrap
                                        sx={{
                                            display: "block",
                                            maxWidth: 150,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {product.description}
                                    </Typography>
                                </TableCell>
                                {/* <TableCell>{product.model_no}</TableCell>
                                <TableCell>{product.barcode}</TableCell> */}
                                <TableCell>
                                    {product.category?.name}
                                    {product.sub_category?.name && (
                                        <>
                                            {" > "}
                                            {product.sub_category.name}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {product.is_available ? (
                                        <Badge color="success" badgeContent="Yes" />
                                    ) : (
                                        <Badge color="error" badgeContent="No" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => handleMenuOpen(e, product.id)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && menuProductId === product.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            component={Link}
                                            href={route("products.edit", product.id)}
                                        >
                                            Edit/View
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleDelete(product.id)}
                                            disabled={processing}
                                        >
                                            Delete
                                        </MenuItem>
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
                    count={products.last_page}
                    page={products.current_page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </DashboardLayout>
    );
};

export default Products;
