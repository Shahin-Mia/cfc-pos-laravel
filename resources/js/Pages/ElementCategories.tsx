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

interface ElementCategory {
    id: number;
    name: string;
}

interface Props {
    elementCategories: {
        data: ElementCategory[],
        per_page?: number,
        current_page?: number,
        next_page_url?: string,
        prev_page_url?: string
    }
}

const ElementCategories: React.FC<Props> = ({ elementCategories }: Props) => {
    console.log(elementCategories);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
    const [alertFailed, setAlertFailed] = useState<string | null>(null);
    const { data, setData, post, put, delete: destroy, reset } = useForm({
        id: 0,
        name: ''
    });

    const handleCreateOrUpdate = () => {
        if (!data.name) {
            setAlertFailed("Category name is required.");
            return;
        }

        setIsLoading(true);

        if (isEditing && editingId) {
            put(route("element-categories.update", editingId), {
                onSuccess: () => {
                    setAlertSuccess("Category successfully updated.");
                    reset();
                },
                onError: () => setAlertFailed("Failed to update category."),
                onFinish: () => setIsLoading(false),
            });
        } else {
            post(route("element-categories.store"), {
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
        const categoryToEdit = elementCategories.data.find((cat) => cat.id === id);
        if (categoryToEdit) {
            setData("name", categoryToEdit.name);
            setIsEditing(true);
            setEditingId(id);
        }
    };

    const handleDelete = (id: number) => {
        setIsLoading(true);
        destroy(route("element-categories.destroy", id), {
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
            <Head title="Element Categories" />
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
                    Element categories
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
                                    {elementCategories.data.map((cat, index) => (
                                        <TableRow key={cat.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {cat.name}
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

export default ElementCategories;
