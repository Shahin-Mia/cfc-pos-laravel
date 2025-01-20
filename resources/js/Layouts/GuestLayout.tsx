import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Box, Grid2 } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Grid2
            container
            sx={{
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: "#ff5f01"
            }}
        >
            {children}
        </Grid2>
    );
}
