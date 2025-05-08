import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from '@inertiajs/react';


function SessionModal({ open, setOpen }: { open: boolean, setOpen: CallableFunction }) {
    const { data, setData, post, processing } = useForm({
        opening_cash: "",
    })
    const handleClose = (event: any, reason: any) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        setOpen(false);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        post(route("start.session"), {
            onSuccess: () => {
                setOpen(false)
            }
        })

    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 999
                }}
            >
                <DialogTitle>
                    Start a new session
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            name='opening_cash'
                            label="Opening Balance"
                            value={data.opening_cash}
                            type="number"
                            onChange={(e) => setData('opening_cash', e.target.value)}
                            fullWidth
                            variant="standard"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{ mt: 2 }}
                            disabled={processing}
                        >
                            Start
                        </Button>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SessionModal;


