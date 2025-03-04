import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface Unit {
    id: number;
    name: string;
    description: string;
}

interface Props {
    units: Unit[];
}

const UnitManagement: React.FC<Props> = ({ units }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy } = useForm({
        id: 0,
        name: '',
        description: '',
    });

    const handleCreate = () => {
        setIsLoading(true);
        post(route("units.store"), {
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const handleUpdate = () => {
        setIsLoading(true);
        put(route("units.update", data.id), {
            onFinish: () => {
                setIsLoading(false);
                setIsEditing(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        setIsLoading(true);
        destroy(route("units.destroy", id), {
            onFinish: () => setIsLoading(false),
        });
    };

    const handleEdit = (unit: Unit) => {
        setIsEditing(true)
        setData('id', unit.id);
        setData('name', unit.name);
        setData('description', unit.description);
    };

    return (
        <DashboardLayout>
            <Head title='Units' />
            <Box sx={{ margin: 3 }}>
                <Typography variant='h4' sx={{ mb: 2 }}>Units</Typography>

                {/* Unit Create Form */}
                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant='h6' sx={{ mb: 1 }}>{isEditing ? 'Update Unit' : 'Create Unit'}</Typography>
                    <form className="row" onSubmit={e => e.preventDefault()}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <TextField
                                label="Enter unit name*"
                                variant="outlined"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                fullWidth
                                sx={{ marginRight: 2 }}
                                size="small"
                            />
                            <TextField
                                label="Enter description"
                                variant="outlined"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                fullWidth
                                sx={{ marginRight: 2 }}
                                size="small"
                            />
                            <div className="col-12 col-md-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={isEditing ? handleUpdate : handleCreate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </Box>
                    </form>
                </Paper>

                {/* Show All Units Table */}
                <Paper sx={{ padding: 1 }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Unit</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {units.map((unit, index) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{unit.name}</TableCell>
                                        <TableCell>{unit.description}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                onClick={() => handleEdit(unit)}
                                                sx={{ marginRight: 1 }}
                                                size='small'
                                            >
                                                Edit
                                            </Button>
                                            <Button size='small' variant="outlined" color="error" onClick={() => handleDelete(unit.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </DashboardLayout>
    );
};

export default UnitManagement;
