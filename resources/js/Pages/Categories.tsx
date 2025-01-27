import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

interface Category {
    id: number;
    name: string;
    category_id?: string;
    parent_name?: string;
}

interface Props {
    categories: Category[];
}

const Categories: React.FC<Props> = ({ categories }: Props) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
    const [alertFailed, setAlertFailed] = useState<string | null>(null);
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        id: 0,
        name: '',
        category_id: '',
    });

    const handleCreateOrUpdate = () => {
        if (!data.name) {
            setAlertFailed("Category name is required.");
            return;
        }

        setIsLoading(true);

        if (isEditing && editingId) {
            // Update category using Inertia
            put(route("categories.update", editingId), {
                onSuccess: () => {
                    setAlertSuccess("Category successfully updated.");
                    reset();
                },
                onError: () => setAlertFailed("Failed to update category."),
                onFinish: () => setIsLoading(false),
            });
        } else {
            // Create category using Inertia
            post(route("categories.store"), {
                onSuccess: () => {
                    setAlertSuccess("Category successfully created.");
                    reset();
                },
                onError: () => setAlertFailed("Failed to create category."),
                onFinish: () => setIsLoading(false),
            });
        }
    };

    const handleEdit = (id: number) => {
        const categoryToEdit = categories.find((cat) => cat.id === id);
        if (categoryToEdit) {
            setData("name", categoryToEdit.name);
            setData("category_id", categoryToEdit.category_id?.toString() || '');
            setIsEditing(true);
            setEditingId(id);
        }
    };

    const handleDelete = (id: number) => {
        setIsLoading(true);
        destroy(route("categories.destroy", id), {
            onSuccess: () => {
                setAlertSuccess("Category successfully deleted.")
                setIsEditing(false);
                setEditingId(null);
            },
            onError: () => setAlertFailed("Failed to delete category."),
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Categories" />
            <Box>
                {alertFailed && (
                    <Alert severity="error" onClose={() => setAlertFailed(null)}>
                        <AlertTitle>Error</AlertTitle>
                        {alertFailed}
                    </Alert>
                )}
                {alertSuccess && (
                    <Alert severity="success" onClose={() => setAlertSuccess(null)}>
                        <AlertTitle>Success</AlertTitle>
                        {alertSuccess}
                    </Alert>
                )}

                {/* Heading */}
                <Typography variant="h4" component="h1" gutterBottom>
                    Categories
                </Typography>

                {/* Form */}
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">
                            {isEditing ? "Update Category" : "Create Category"}
                        </Typography>
                        <form style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <Stack direction="row" spacing={2} width="100%">
                                <TextField
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    label="Category Name"
                                    size="small"
                                    fullWidth
                                    required
                                />
                                <Select
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value={0}>Choose Sub-Category</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateOrUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} />
                                    ) : isEditing ? (
                                        "Update"
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardContent>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((cat, index) => (
                                        <TableRow key={cat.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {cat.name}
                                                {cat.parent_name && ` -> ${cat.parent_name}`}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handleEdit(cat.id)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default Categories;
