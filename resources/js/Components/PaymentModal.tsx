import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { forwardRef, Fragment } from 'react';
import CirculerLogoProgess from './CirculerLogoProgess';

const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymentModal({
    open,
    setOpen,
    totalPrice,
    payment_method,
    handleSubmit,
    loading
}: any) {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="payment-alert-dialog-"
            >
                {
                    !loading ? (
                        <Box>
                            <DialogTitle>Is Payment done through {payment_method}?</DialogTitle>
                            <DialogContent sx={{ textAlign: "center" }}>
                                <Typography variant='subtitle1'>Total Amount</Typography>
                                <Typography variant='h4'>RM {totalPrice}</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
                                <Button onClick={handleSubmit} variant='contained' color='success'>Done</Button>
                            </DialogActions>
                        </Box>
                    ) : (
                        <CirculerLogoProgess />
                    )
                }
            </Dialog>
        </Fragment>
    );
}
