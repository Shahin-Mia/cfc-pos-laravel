import Grid from '@mui/material/Grid2'
import AuthenticatedLayout from './AuthenticatedLayout'
import Sidebar from '@/Components/Sidebar'
import { ReactNode } from 'react'

function DashboardLayout({ children }: { children?: ReactNode }) {
    return (
        <AuthenticatedLayout>
            <Grid container sx={{ height: 'calc(100% - 64px)' }}>
                <Grid size={{ xs: 2.5 }} sx={{
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    height: "100%",
                }}>
                    <Sidebar />
                </Grid>

                <Grid size={{ xs: 9.5 }} sx={{
                    padding: 2,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                    height: "100%",
                    '&::-webkit-scrollbar': {
                        width: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                    },
                }}>
                    {children}
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default DashboardLayout