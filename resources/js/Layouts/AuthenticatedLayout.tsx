import { Link, router, usePage } from '@inertiajs/react';
import React, { createContext, PropsWithChildren, ReactNode, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Button } from '@mui/material';
import Drowpdown from '@/Components/Dropdown';
import { Assignment, Close, Fastfood, Sell } from '@mui/icons-material';
import { useCartStore } from '@/store/useCartStore';


const drawerWidth = 20;

interface MainProps {
    open?: boolean;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainProps>(
    ({ theme }) => ({
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: `${-drawerWidth}%`,
        position: 'relative',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginRight: 0,
                },
            },
        ],
        height: '100vh',
        overflow: 'hidden'
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<MainProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}%)`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginRight: `${drawerWidth}%`,
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    height: 'auto'
}));


export default function AuthenticatedLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const session_id = useCartStore((state: any) => state.session_id)
    const setSessionId = useCartStore((state: any) => state.setSessionId);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const sidebarItems = [
        {
            id: 1,
            name: "Meals",
            icon: <Fastfood />,
            href: "home",
        },
        {
            id: 2,
            name: "Orders",
            icon: <Assignment />,
            href: "orders.index",
        },
        {
            id: 3,
            name: "Sales",
            icon: <Sell />,
            href: "sales.index"
        }
    ];

    const endSession = () => {
        router.get(route("end.session", session_id), {}, {
            onSuccess: () => {
                setSessionId('');
            }
        });
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt="chairman-fried-chicken-logo" src="/storage/images/cfc-logo.png" />
                        <Typography variant="h6" noWrap component="div" sx={{ marginLeft: 2 }}>
                            Chairman Fried Chicken
                        </Typography>
                    </Box>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        sx={[open && { display: 'none' }]}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>
            <Drawer
                sx={{
                    width: `${drawerWidth}%`,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: `${drawerWidth}%`,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Drowpdown>
                        <Avatar src={""} alt={user.name} />
                    </Drowpdown>
                </DrawerHeader>
                <Divider />
                <List>
                    {
                        sidebarItems.map((item, index) => (
                            <ListItem key={item.id} disablePadding>
                                <ListItemButton component={Link} href={route(item.href)}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
                {
                    session_id ?
                        <Button
                            sx={{
                                mt: 'auto',
                                mx: 1,
                                mb: 1,
                                width: 80,
                                height: 100,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            size='small'
                            variant='outlined'
                            color='error'
                            onClick={endSession}
                        >
                            <span><Close /></span>
                            <span>End Session</span>
                        </Button> :
                        <Button
                            sx={{
                                mt: 'auto',
                                mx: 1,
                                mb: 1,
                                width: 80,
                                height: 100,
                                textAlign: 'center'
                            }}
                            size='small'
                            variant='outlined'
                            color='primary'
                            component={Link}
                            href={route('home')}
                        >
                            <span>Start Session</span>
                        </Button>
                }
            </Drawer>
        </Box >
    );
}


