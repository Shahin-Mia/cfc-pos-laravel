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
    Pagination
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, MoreVert } from '@mui/icons-material';
import { useState } from "react";

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

function Production({ productions }: { productions: ProductionProps }) {
    console.log(productions);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProductionId, setSelectedProductionId] = useState<number | null>(null);

    const { delete: deleteProduction } = useForm();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedProductionId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProductionId(null);
    };

    const handleDelete = (id: number) => {
        router.delete(`/production/${id}`);
    };
    return (
        <DashboardLayout>
            <Head title="Production" />
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
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {production.quantity} <Typography variant="caption">| {production.unit.name}</Typography>
                                            </TableCell>
                                            <TableCell>{production.price.toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                {production.products && production.products.length > 0 ? (
                                                    <Button
                                                        href={`/product/${production.products[0].id}/edit`}
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
                                                    <MenuItem component="a" href={`/production/${production.id}/edit`}>View/Edit</MenuItem>
                                                    <MenuItem component="a" href={`/product/create?production_id=${production.id}`}>Add to Product</MenuItem>
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