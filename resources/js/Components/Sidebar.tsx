import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Divider,
} from '@mui/material';
import {
    Dashboard,
    ListAlt,
    Assessment,
    Money,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';

// Define the state type for managing the open/close state of menus
type MenuState = {
    products: boolean;
    elements: boolean;
    accounting: boolean;
    reports: boolean;
    settings: boolean;
};

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState<MenuState>({
        products: false,
        elements: false,
        accounting: false,
        reports: false,
        settings: false,
    });
    const toggleMenu = (menu: keyof MenuState) => {
        setOpen((prevState) => ({ ...prevState, [menu]: !prevState[menu] }));
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                bgcolor: 'background.paper',
                borderRight: "1px solid grey",
            }}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/dashboard">
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <Divider />
                {/* Products Menu */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleMenu('products')} divider>
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <ListItemText primary="Products" />
                        {open.products ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.products} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} href={route("units.index")} sx={{ pl: 4 }}>
                            <ListItemText primary="Units" />
                        </ListItemButton>
                        <ListItemButton component={Link} href={route("categories.index")} sx={{ pl: 4 }}>
                            <ListItemText primary="Categories" />
                        </ListItemButton>
                        <ListItemButton component={Link} href={route("products.index")} sx={{ pl: 4 }}>
                            <ListItemText primary="Products" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
                {/* Elements Menu */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleMenu('elements')} divider>
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <ListItemText primary="Elements" />
                        {open.elements ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.elements} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} href={route("elements.index")} sx={{ pl: 4 }}>
                            <ListItemText primary="Elements" />
                        </ListItemButton>
                        <ListItemButton component={Link} href={route("productions.index")} sx={{ pl: 4 }}>
                            <ListItemText primary="Production" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleMenu('accounting')}>
                        <ListItemIcon>
                            <Money />
                        </ListItemIcon>
                        <ListItemText primary="Accounting" />
                        {open.accounting ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.accounting} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} href="/elements" sx={{ pl: 4 }}>
                            <ListItemText primary="Elements" />
                        </ListItemButton>
                        <ListItemButton component={Link} href="/production" sx={{ pl: 4 }}>
                            <ListItemText primary="Production" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleMenu('reports')}>
                        <ListItemIcon>
                            <Assessment />
                        </ListItemIcon>
                        <ListItemText primary="Reports" />
                        {open.reports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.reports} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} href="/elements" sx={{ pl: 4 }}>
                            <ListItemText primary="Elements" />
                        </ListItemButton>
                        <ListItemButton component={Link} href="/production" sx={{ pl: 4 }}>
                            <ListItemText primary="Production" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Divider />
            </List>
        </Box>
    );
};

export default Sidebar;
