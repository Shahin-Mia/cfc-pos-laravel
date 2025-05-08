import Dialog from '@mui/material/Dialog';
import CirculerLogoProgess from './CirculerLogoProgess';


export default function ProgressModal({
    open,
    setOpen
}: any) {

    const handleClose = (event: any, reason: any) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            sx={{
                backdropFilter: "blur(2px)",
                zIndex: 1000,
                ".css-10d30g3-MuiPaper-root-MuiDialog-paper": {
                    backgroundColor: "transparent",
                    color: "white",
                    boxShadow: "none",
                }
            }}
        >
            <CirculerLogoProgess />
        </Dialog >
    );
}
