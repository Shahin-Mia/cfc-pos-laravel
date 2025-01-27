import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/Layouts/DashboardLayout";


const Products: React.FC<any> = ({ products, pagination }) => {
    const { delete: destroy, processing } = useForm();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuProductId, setMenuProductId] = React.useState<number | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setMenuProductId(id);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuProductId(null);
    };

    const handleDelete = (id: number) => {
        destroy(route("product.destroy", id), {
            preserveScroll: true,
        });
        handleMenuClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const query = new URLSearchParams(window.location.search);
        query.set("page", page.toString());
        window.location.href = `${window.location.pathname}?${query.toString()}`;
    };

    return (
        <DashboardLayout>
            <Head title="Products" />
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>P.Price</TableCell>
                            <TableCell>S.Price</TableCell>
                            <TableCell>StockQty</TableCell>
                            <TableCell>Img</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Serial</TableCell>
                            <TableCell>Barcode</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Avail.</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.data.map((product: any, index: any) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {(pagination.current_page - 1) * pagination.per_page + index + 1}
                                </TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>{product.purchasePrice.toFixed(2)}</TableCell>
                                <TableCell>{product.salePrice.toFixed(2)}</TableCell>
                                <TableCell>{product.stockQty}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Image">
                                        <Avatar
                                            src={product.image}
                                            alt="Product Image"
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </Tooltip>
                                </TableCell>
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
                                <TableCell>{product.serial}</TableCell>
                                <TableCell>{product.barcode}</TableCell>
                                <TableCell>
                                    {product.category?.name}
                                    {product.subCategory?.name && (
                                        <>
                                            {" => "}
                                            {product.subCategory.name}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isAvailable ? (
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
                                            href={route("product.edit", product.id)}
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
                    count={pagination?.last_page}
                    page={pagination?.current_page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </DashboardLayout>
    );
};

export default Products;
