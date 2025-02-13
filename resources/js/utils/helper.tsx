import { SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent } from "react";

export const handleSnackbarClose = (event: SyntheticEvent<Element, Event> | Event, reason?: SnackbarCloseReason, callback?: CallableFunction) => {
    if (reason === 'clickaway') {
        return;
    }

    if (callback) {
        callback();
    }
};