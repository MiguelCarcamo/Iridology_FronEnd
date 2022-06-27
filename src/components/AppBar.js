import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Cookies from 'universal-cookie';
import { Box, Tooltip, Avatar, Menu, MenuItem } from "@mui/material";
import ListItem from '../components/listItems'

const drawerWidth = 260;
const cookies = new Cookies();

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


export default function AppBarNav() {
    const navigate = useNavigate();
    const SignOff=()=>{
        cookies.remove('IDUser', {path: "/"});
        cookies.remove('IDTypeUser', {path: "/"});
        cookies.remove('UserName', {path: "/"});
        cookies.remove('Status', {path: "/"});
        cookies.remove('User', {path: "/"});
        cookies.remove('UserLenguage', {path: "/"});
        cookies.remove('UserMail', {path: "/"});
        cookies.remove('UserLastName', {path: "/"});
        cookies.remove('UserPhone', {path: "/"});
        navigate('/');
    }    
    const [open, setOpen] = useState(true);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };    
    const toggleDrawer = () => {
      setOpen(!open);
    };
    return (
        <>
            <AppBar position="absolute" open={open} sx={{ background: '#25314F' }}>
                <Toolbar sx={{ pr: '24px', }} >
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{marginRight: '36px', ...(open && { display: 'none' }),}} >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
                        Iridology App
                    </Typography>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{color: "Black"}}>{cookies.get('UserName').charAt(0)+cookies.get('UserLastName').charAt(0)}</Avatar>
                            </IconButton>
                            </Tooltip>
                            <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            >
                            <MenuItem onClick={SignOff}>
                                <Typography >LogOut</Typography>
                            </MenuItem>
                            </Menu>
                            
                        </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1], }} >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItem />
                </List>
            </Drawer>
        </>
    );
}