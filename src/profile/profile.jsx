import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid2';
import Toolbar from '@mui/material/Toolbar';
import { Button, Avatar, Alert, Typography, TextField, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ProfileField from "../main/profileField";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PasswordIcon from '@mui/icons-material/Password';
import GoogleIcon from '@mui/icons-material/Google';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './profile.css';
import { userGetCredential } from "../auth/authAction";
import axios from "../auth/axios";
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

function Profile() {
    const { userInfo, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [status, setStatus] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [linkedId, setLinkedId] = useState("");
    const [linkedEmail, setLinkedEmail] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [showErrMsg, setShowErrMsg] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newZipcode, setNewZipcode] = useState(""); 
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [showChangePhoto, setShowChangePhoto] = useState(false);

    const toMainPage = () => {
        navigate('/main');
    }

    const updateUsername = () => {
        if (!newUsername) return;
        const usernamePattern = /^[A-Za-z][A-Za-z0-9]*$/;
        setUsername(newUsername);
        setNewUsername("");
    }

    const updateEmail = () => {
        if (!newEmail) return;
        axios.put('/email', { email: newEmail }).then(() => {
            setEmail(newEmail);
            setNewEmail("");
        });
    }

    const updatePhoneNumber = () => {
        if (!newPhoneNumber) return;
        axios.put('/phone', { phone: newPhoneNumber }).then(() => { 
            setPhoneNumber(newPhoneNumber);
            setNewPhoneNumber("");
        });
    }

    const updateZipcode = () => {
        if (!newZipcode) return;
        axios.put('/zipcode', { zipcode: newZipcode }).then(() => {
            setZipcode(newZipcode);
            setNewZipcode("");
        });
    }

    const updatePassword = () => {
        if (!newPassword && !newPasswordConfirm) return;
        axios.put('/password', { newPassword }).then(() => {
            setNewPassword("");
            setNewPasswordConfirm("");
        });
    }

    const linkGoogle = () => {
        window.open('https://ricebook-ct100-33acd3c66081.herokuapp.com/auth/google/link', '_self');
    }

    const updateInfo = () => {
        const usernamePattern = /^[A-Za-z][A-Za-z0-9]*$/;
        const emailPattern = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
        const phoneNumberPattern = /^\d{10}$/;
        const zipcodePattern = /^\d{5,6}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        let valid = true;
        let usernameValid = true, emailValid = true, phoneNumberValid = true, zipcodeValid = true, passwordValid = true, passwordSameValid = true;
        if (newUsername && !usernamePattern.test(newUsername)) {
            valid = usernameValid = false;
        }
        if (newEmail && !emailPattern.test(newEmail)) {
            valid = emailValid = false;
        }
        if (newPhoneNumber && !phoneNumberPattern.test(newPhoneNumber)) {
            valid = phoneNumberValid = false;
        }
        if (newZipcode && !zipcodePattern.test(newZipcode)) {
            valid = zipcodeValid = false;
        } 
        if (newPassword && newPasswordConfirm && (!passwordPattern.test(newPassword) || newPassword !== newPasswordConfirm)) {
            valid = false;
            if (!passwordPattern.test(newPassword))
                passwordValid = false;
            else
                passwordSameValid = false;
        }

        setErrMsg("");
        if (!valid) {
            if (!usernameValid)
                setErrMsg(prev => prev + 'Please input a valid username: must start with letter and can only contain letters and numbers.');
            if (!emailValid)
                setErrMsg(prev => prev + 'Please input a valid email.');
            if (!phoneNumberValid)
                setErrMsg(prev => prev + 'Please input a valid phone number.');
            if (!zipcodeValid)
                setErrMsg(prev => prev + 'Please input a valid zipcode.');
            if (!passwordValid)
                setErrMsg(prev => prev + 'Invalid password: must contain at least an uppercase letter, a lowercase letter, a number, and a special character (@, $, !, %, *, ?, &, #, ^), the minimal length of your password should be 8.');
            if (!passwordSameValid)
                setErrMsg(prev => prev + 'Password confirmation should be the same as password.');

            setShowErrMsg(true);
            return;
        }

        setShowErrMsg(false);
        setErrMsg("");
        updateUsername();
        updateEmail();
        updatePhoneNumber();
        updateZipcode();
        updatePassword();
    }

    useEffect(() => {
        axios.get('/isLoggedIn').catch(() => {
            navigate('/');
        });
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!loading && !userToken) {
            navigate('/');
        }

        if (!loading && userToken) {
            const [id, user] = userToken.split('_');
            setPassword("********");
            dispatch(userGetCredential({ userToken })).then((res) => {
                setUsername(res.payload.username);
                setEmail(res.payload.email);
                setPhoneNumber(res.payload.phone);
                setZipcode(res.payload.zipcode);
                setStatus(res.payload.headline);
                setAvatar(res.payload.avatar);
                setDisplayName(res.payload.displayName);
                setLinkedId(res.payload.linkedId);
                setLinkedEmail(res.payload.linkedEmail);
            });
        }
    }, [loading]);

    return (
        loading ? 
                    <div>loading</div> 
                : 
                    !localStorage.getItem('userToken') ? <Navigate to='/' />
                : 
                    <div>
                        <style>{'body { background-color: rgb(240, 242, 245); }'}</style>
                        <AppBar>
                            <Toolbar className='navbar'>
                                <img 
                                    className='ricebook-logo' 
                                    src='https://seeklogo.com/images/R/rice-university-athletic-logo-818A1AFD94-seeklogo.com.png' 
                                    onClick={() => {
                                        navigate('/main');
                                    }}
                                />
                                <Grid sx={{ flexGrow: 1 }}></Grid>
                                <Grid container sx={{ flexGrow: 1 }}>
                                    <div className='navbar-button-container' onClick={toMainPage}>
                                        <Button className='navbar-button'>
                                            <HomeIcon fontSize="large" className='navbar-button-icon'/>
                                        </Button>
                                    </div>
                                    <div className='navbar-button-container-select'>
                                        <Button className='navbar-button'>
                                            <PersonIcon fontSize="large" className='navbar-button-icon-select'/>
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid sx={{ flexGrow: 1 }}></Grid>
                                <ProfileField username={displayName} status={status} avatar={avatar}></ProfileField>
                            </Toolbar>
                        </AppBar>      
                        <div style={{position: 'relative', display: 'flex', justifyContent: 'center', top: '100px'}}>
                            <Toolbar/>
                            <label>
                                <Avatar 
                                    src={showChangePhoto ? '' : avatar} 
                                    sx={{width: '200px', height: '200px'}}
                                    onMouseOver={() => {
                                        setShowChangePhoto(true);           
                                    }}
                                    onMouseLeave={() => {
                                        setShowChangePhoto(false);
                                    }}
                                >
                                    {showChangePhoto ? <IconButton component="span">
                                        <AddAPhotoIcon sx={{height: '50%', width: '50%'}}/>
                                    </IconButton> : <AccountCircleIcon color="disabled" sx={{height: '120%', width: '120%'}}/>}
                                </Avatar>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (!e.target.files[0]) return;
                                        try {
                                            const formData = new FormData();
                                            formData.append('title', username);
                                            formData.append('image', e.target.files[0]);
                                            axios.put('/avatar', formData, {
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                            }).then((res) => {
                                                setAvatar(res.data.avatar);
                                            });
                                        } catch (error) {
                                            console.error(error);
                                        } finally {
                                            e.target.value = null;
                                        }
                                    }}
                                />
                            </label>
                            <div style={{position: 'relative', left: '20px', marginTop: 'auto', marginBottom: 'auto'}}>
                                <div style={{display: 'flex'}}>
                                    <Typography variant="h3">{displayName}</Typography>
                                    {
                                        (displayName === username && linkedId === '') ? <Button variant="outlined" style={{marginLeft: '20px', height: '40px', marginTop: '10px'}} onClick={linkGoogle}>
                                            <GoogleIcon style={{marginRight: '10px'}}/>
                                            Link Account
                                        </Button> : <></>
                                    }
                                </div>
                                <Typography variant="h7">{'@' + username + (linkedEmail ? (' (' + linkedEmail + ')') : "")}</Typography>
                                <Typography variant="h5">{status}</Typography>
                                <div style={{display: 'flex'}}>
                                    <EmailIcon/>
                                    <a style={{marginLeft: '5px'}}>{email}</a>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <LocalPhoneIcon/>
                                    <a style={{marginLeft: '5px'}}>{phoneNumber}</a>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <LocationOnIcon/>
                                    <a style={{marginLeft: '5px'}}>{zipcode}</a>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <PasswordIcon/>
                                    <a style={{marginLeft: '5px'}}>{"*".repeat(password.length)}</a>
                                </div>
                            </div>
                        </div>
                        <div className="info-field-container" style={{position: 'relative', top: '120px'}}>
                            {/* <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Username"
                                    className="info-input"
                                    value={newUsername}
                                    onChange={(e) => { setNewUsername(e.target.value) }}
                                ></TextField>
                            </div> */}
                            <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Email"
                                    className="info-input"
                                    value={newEmail}
                                    onChange={(e) => { setNewEmail(e.target.value) }}
                                ></TextField>
                            </div>
                            <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Phone Number"
                                    className="info-input"
                                    value={newPhoneNumber}
                                    onChange={(e) => { setNewPhoneNumber(e.target.value) }}
                                ></TextField>
                            </div>
                            <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Zipcode"
                                    className="info-input"
                                    value={newZipcode}
                                    onChange={(e) => { setNewZipcode(e.target.value) }}
                                ></TextField>
                            </div>
                            <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Password"
                                    className="info-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value) }}
                                ></TextField>
                            </div>
                            <div className="info-field">
                                <TextField  
                                    size="medium"
                                    label="Password Confirmation"
                                    className="info-input"
                                    type="password"
                                    value={newPasswordConfirm}
                                    onChange={(e) => { setNewPasswordConfirm(e.target.value) }}
                                ></TextField>
                            </div>
                            <div className="info-field">
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    sx={{height: '50px'}}
                                    onClick={updateInfo}
                                    disabled= { !newUsername && !newEmail && !newPhoneNumber && !newZipcode && (!newPassword || !newPasswordConfirm) }
                                >
                                    Update
                                </Button>
                            </div>
                            {showErrMsg ? <Alert 
                                            severity="error" onClose={() => {
                                                setShowErrMsg(false);
                                                setErrMsg('');
                                            }} 
                                          >
                                            {errMsg}
                                          </Alert> : <></>}
                        </div>
                    </div>
    )
}

export default Profile;