import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Avatar, Menu, Typography, Divider, MenuItem } from "@mui/material";
import { logout } from '../auth/authSlice';
import { useNavigate } from "react-router-dom";
import axios from "../auth/axios";

axios.defaults.withCredentials = true;

function ProfileField({username, status, avatar}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
            <div className='inline-display'>
                <IconButton onClick={handleMenu}>
                    <Avatar src={avatar}></Avatar>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    disableScrollLock={true}
                >
                    <Typography variant='h6' style={{color: 'black', paddingLeft: '5px', paddingRight: '5px'}}>{username}</Typography>
                    <Divider style={{border: '0.5px solid black', marginLeft: '5px', marginRight: '5px'}}/>
                    <MenuItem onClick={() => { navigate('/profile'); }}>Profile</MenuItem>
                    <MenuItem onClick={async () => {
                        await axios.put('/logout');
                        dispatch(logout());
                        navigate('/');
                    }}>Logout</MenuItem>
                </Menu>
            </div>
    );
}

export default ProfileField;