import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { Link } from '@inertiajs/react';

export default function Drowpdown({
    children,

}: {
    children: React.ReactNode
}) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {children}
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Link
                    href={route('dashboard')}
                    style={{ background: "none", border: "none", width: "100%" }}
                    as="button"
                >
                    <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                </Link>
                <MenuItem onClick={handleClose}>My account</MenuItem>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    style={{ background: "none", border: "none", width: "100%" }}
                >
                    <MenuItem>Logout</MenuItem>
                </Link>
            </Menu>
        </div>
    );
}
