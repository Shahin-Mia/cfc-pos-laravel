import { Box, CircularProgress, Typography } from '@mui/material';
import ApplicationLogo from './ApplicationLogo';

function CirculerLogoProgess() {
    return (
        <Box sx={{ display: "flex", padding: 5, flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ position: "relative" }}>
                <CircularProgress size={70} />
                <ApplicationLogo
                    style={{ position: "absolute", top: 5, left: 5, right: 0, bottom: 0 }}
                    width={60}
                    height={60}
                />
            </Box>
            <Typography variant='button'>Processing...</Typography>
        </Box>
    )
}

export default CirculerLogoProgess