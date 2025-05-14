import DashboardLayout from "@/Layouts/DashboardLayout"
import { Head, Link } from "@inertiajs/react"
import { Add } from "@mui/icons-material"
import { Button, Chip, Container, IconButton, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import ExpenseForm from "./ExpenseForm";

type Props = {
    expenses: any[],
}

function Expenses({ expenses }: Props) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [expense, setExpense] = useState<any>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedExpenseId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (expense: any) => {
        setExpense(expense);
        handleOpenModal();
    };

    const handleDelete = () => { };

    const handleOpenModal = () => {
        setOpen(true);
    };
    return (
        <DashboardLayout>
            <Head title="Expense" />
            <Container>
                <Stack direction={'row'} spacing={2} sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h5">Expenses</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenModal}>Add Expense</Button>
                </Stack>
                <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                expenses.map((expense, index) => (
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell>
                                            {expense.amount}
                                            <Chip
                                                label="Receipt"
                                                component={'a'}
                                                href={route("expense.getReceipt", expense.id)}
                                                variant="outlined"
                                                size="small"
                                                clickable
                                                sx={{ mx: 2 }}
                                            />
                                        </TableCell>
                                        <TableCell>{expense.expense_date}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={(event) => handleMenuClick(event, expense.id)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl && selectedExpenseId === expense.id)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => handleEdit(expense)}>View/Edit</MenuItem>
                                                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <ExpenseForm open={open} setOpen={setOpen} expense={expense} setExpense={setExpense} />
            </Container>
        </DashboardLayout>
    )
}

export default Expenses