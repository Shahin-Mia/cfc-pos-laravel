import DashboardLayout from "@/Layouts/DashboardLayout"
import { Head, Link } from "@inertiajs/react"
import { useForm } from '@inertiajs/react';
import { usePage, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Pagination,
    Snackbar,
    Alert,
    SnackbarCloseReason
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, MoreVert } from '@mui/icons-material';
import { SyntheticEvent, useEffect, useState } from "react";

interface Production {
    id: number;
    title: string;
    description: string;
    quantity: number;
    price: number;
    created_at: string;
    unit: { name: string };
    products?: { id: number }[];
}

interface ProductionProps {
    data: Production[];
    current_page: number;
    last_page: number;
    links: any;
}

function Production({ productions, flash }: { productions: ProductionProps, flash: any }) {
    console.log(productions)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProductionId, setSelectedProductionId] = useState<number | null>(null);
    useEffect(() => {
        if (flash.success || flash.error) {
            console.log(flash);
            setOpenSnackbar(true);
        }
    }, [flash]);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedProductionId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProductionId(null);
    };

    const handleDelete = (id: number) => {
        router.delete(route("productions.destroy", id));
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
            <Box>
                <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Production</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Add />}
                        href={route("productions.create")}
                        component={Link}
                    >
                        Add Production
                    </Button>
                </Grid>

                {/* Search Field */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container justifyContent="center">
                            <TextField
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                variant="outlined"
                                size="small"
                                placeholder="Enter production title..."
                                fullWidth
                                sx={{ maxWidth: 400 }}
                            />
                        </Grid>
                    </CardContent>
                </Card>

                {/* Production Table */}
                <Card>
                    <CardContent>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                                        <TableCell>#</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="center">Qty</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell align="center">Has Product</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productions.data.map((production, index) => (
                                        <TableRow key={production.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{new Date(production.created_at).toLocaleDateString()}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(production.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{production.title}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={production.description}
                                                    multiline
                                                    fullWidth
                                                    size="small"
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {production.quantity} <Typography variant="caption">| {production.unit.name}</Typography>
                                            </TableCell>
                                            <TableCell>{production.price.toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                {production.products && production.products.length > 0 ? (
                                                    <Button
                                                        // href={`/product/${production.products[0].id}/edit`}
                                                        variant="contained"
                                                        size="small"
                                                        color="success"
                                                    >
                                                        Yes
                                                    </Button>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={(e) => handleMenuClick(e, production.id)}>
                                                    <MoreVert />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={selectedProductionId === production.id}
                                                    onClose={handleMenuClose}
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                >
                                                    <MenuItem component={Link} href={route("productions.edit", production.id)}>View/Edit</MenuItem>
                                                    <MenuItem component={Link} href={route("products.create", { production_id: production.id })}>Add to Product</MenuItem>
                                                    <MenuItem onClick={() => handleDelete(production.id)}>Delete</MenuItem>
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
                                count={productions.links.last_page}
                                page={productions.links.current_page}
                                onChange={(_, page) => router.get(`/production?page=${page}`)}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    )
}

export default Production