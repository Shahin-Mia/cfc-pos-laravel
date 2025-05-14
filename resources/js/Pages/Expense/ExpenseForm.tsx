import { VisuallyHiddenInput } from '@/Components/VisuallyHiddenInput'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import { ChevronLeft, CloudUpload } from '@mui/icons-material'
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Grid2 as Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useEffect } from 'react'

type Props = {
    open: boolean,
    setOpen: CallableFunction,
    expense: any,
    setExpense: CallableFunction
}

interface FormData {
    description: string,
    amount: number | string,
    expense_date: string | undefined,
    attachments: File | null
}

function ExpenseForm({ open, setOpen, expense, setExpense }: Props) {

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        description: '',
        amount: '',
        expense_date: '',
        attachments: null
    });
    useEffect(() => {
        if (expense) {
            setData("description", expense.description);
            setData("amount", expense.amount);
            setData("expense_date", expense.expense_date);
        }
    }, [expense]);

    const handleClose = () => {
        setOpen(false);
        setExpense(null);
        reset();
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (expense) {
            post(route('expenses.update', expense.id), {
                onSuccess: handleClose
            })
        } else {
            post(route('expenses.store'), {
                onSuccess: handleClose
            });
        }
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography variant="h5">
                    {
                        expense ? "Expense Edit" : "Expense Create"
                    }
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Paper sx={{ p: 2, my: 2 }}>
                    <Box component={'form'} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    multiline
                                    fullWidth
                                    label="Description"
                                    variant='outlined'
                                    rows={4}
                                    size="small"
                                    value={data.description}
                                    onChange={(event) => setData('description', event?.target.value)}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack spacing={1}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        variant='outlined'
                                        size="small"
                                        type="number"
                                        value={data.amount}
                                        onChange={(event) => setData('amount', event?.target.value)}
                                        error={!!errors.amount}
                                        helperText={errors.amount}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Expense Date"
                                            value={dayjs(data.expense_date)}
                                            onChange={(value) => setData('expense_date', value?.format('YYYY-MM-DD'))}
                                            format='DD-MM-YYYY'
                                            slotProps={{
                                                textField: {
                                                    error: !!errors.expense_date,
                                                    helperText: errors.expense_date
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload />}
                                    fullWidth
                                >
                                    Attach Receipt*
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => {
                                            if (event.target.files && event.target.files[0]) {
                                                setData("attachments", event.target.files[0]);
                                            }
                                        }}
                                    />
                                </Button>
                                {errors.attachments && <Typography color="error" variant="caption">{errors.attachments}</Typography>}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Button variant="contained" type="submit" loading={processing}>
                                    {
                                        expense ? "Update" : "Save"
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </DialogContent>
        </Dialog>
    )
}

export default ExpenseForm