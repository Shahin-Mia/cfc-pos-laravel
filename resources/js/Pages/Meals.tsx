import React, { SyntheticEvent, useEffect, useState } from "react";
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
    SnackbarCloseReason,
    Snackbar,
    Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/Layouts/DashboardLayout";


const Meals: React.FC<any> = ({ meals, flash }) => {
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
        destroy(route("meals.destroy", id), {
            preserveScroll: true,
        });
        handleMenuClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const query = new URLSearchParams(window.location.search);
        query.set("page", page.toString());
        window.location.href = `${window.location.pathname}?${query.toString()}`;
    };

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <DashboardLayout>
            <Head title="Meals" />
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
                <Typography variant="h5">Meals</Typography>
                <Link href={route("meals.create")}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add Meal
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
                            <TableCell>Sale Price</TableCell>
                            <TableCell>Img</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="center">Avail.</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {meals.data.map((meal: any, index: any) => (
                            <TableRow key={meal.id}>
                                <TableCell>
                                    {(meals.current_page - 1) * meals.per_page + index + 1}
                                </TableCell>
                                <TableCell>{meal.title}</TableCell>
                                <TableCell>
                                    {meal.purchase_price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {meal.sale_price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="View Image">
                                        <Avatar
                                            src={`/storage/${meal.image.image}`}
                                            alt="Meal Image"
                                            sx={{ width: 40, height: 40 }}
                                            variant="square"
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
                                        {meal.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {meal.meal_category?.name}
                                </TableCell>
                                <TableCell align="center">
                                    {meal.is_available ? (
                                        <Badge color="success" badgeContent="Yes" />
                                    ) : (
                                        <Badge color="error" badgeContent="No" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => handleMenuOpen(e, meal.id)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && menuProductId === meal.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            component={Link}
                                            href={route("meals.edit", meal.id)}
                                        >
                                            Edit/View
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleDelete(meal.id)}
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
                    count={meals.last_page}
                    page={meals.current_page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </DashboardLayout>
    );
};

export default Meals;
