import { VisuallyHiddenInput } from "@/Components/VisuallyHiddenInput"
import DashboardLayout from "@/Layouts/DashboardLayout"
import { Head, router, useForm } from "@inertiajs/react"
import { Alert, Avatar, Box, Button, Card, CardContent, Paper, Snackbar, SnackbarCloseReason, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";


interface FormData {
    name: string,
    description: string,
    image: File | null
}

const MealCategory = ({ mealCategories, flash }: any) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [editingId, setEditingId] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: "",
        description: "",
        image: null
    });

    useEffect(() => {
        if (flash.success || flash.error) {
            setOpenSnackbar(true);
        }
    }, [flash]);

    const handleEdit = (mealCategory: any) => {
        setEditingId(mealCategory.id);
        setData("name", mealCategory.name);
        setData("description", mealCategory.description);
    }

    const handleDelete = (categoryId: number) => {
        router.delete(route("meal-categories.destroy", categoryId));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingId) {
            post(route("meal-categories.update", editingId.toString()), {
                onSuccess: () => {
                    reset();
                    setEditingId(false);
                }
            });
        } else {
            post(route("meal-categories.store"), {
                onSuccess: () => {
                    reset();
                }
            });
        }
    }

    const handleClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    return (
        <DashboardLayout>
            <Head title="Meal Category" />
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
                <Typography variant="h5" sx={{ mb: 1 }}>Meal Categories</Typography>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ fontSize: 20, mb: 1 }}>
                            {
                                editingId ? "Update Category" : "Create Category"
                            }
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Stack direction="row" spacing={2}>
                                <Stack spacing={1} width="100%">
                                    <TextField
                                        label="Category name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        fullWidth
                                        size="small"
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Image*
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={(event) => {
                                                if (event.target.files && event.target.files[0]) {
                                                    setData("image", event.target.files[0]);
                                                }
                                            }}
                                        />
                                    </Button>
                                    {errors.image && <Typography color="error" variant="caption">{errors.image}</Typography>}
                                </Stack>
                                <TextField
                                    label="Description"
                                    multiline
                                    fullWidth
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    size="small"
                                    rows={3}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                />
                            </Stack>
                            <Button variant="contained" type="submit" sx={{ mt: 1 }} disabled={processing}>
                                {
                                    processing ?
                                        editingId ?
                                            "Updating..." :
                                            "Creating..." :
                                        editingId ?
                                            "Update" :
                                            "Create"
                                }
                            </Button>
                        </Box>
                    </CardContent>
                </Card>


                <TableContainer component={Paper} sx={{ mt: 1 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                mealCategories.data.map((cat: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{(mealCategories.current_page - 1) * mealCategories.per_page + index + 1}</TableCell>
                                        <TableCell>{cat.name}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={`/storage/${cat.image.image}`}
                                                variant="square"
                                            />
                                        </TableCell>
                                        <TableCell>{cat.description}</TableCell>
                                        <TableCell>
                                            <Button size="small" color="info" onClick={() => handleEdit(cat)}>Edit</Button>
                                            <Button color="error" size="small" onClick={() => handleDelete(cat.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardLayout>
    )
}

export default MealCategory