import './auth.css';
import { useState, useEffect } from "react";
import { Alert, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from './authAction';
import axios from './axios';

axios.defaults.withCredentials = true;

function Auth() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState("");
    const [showErrMsg, setShowErrMsg] = useState(false);
    const {loading, error, userInfo, userToken} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const login = async () => {
        if (username === '' || password === '') {
            setErrMsg("Missing username or password.");
            setShowErrMsg(true);
            return;
        }
        const loginRes = await dispatch(userLogin({username, password}));
        if (loginRes.payload === 'success') {
            navigate('/main');
        } else {
            setErrMsg(loginRes.payload);
            setShowErrMsg(true);
        }
    }

    const googleLogin = async () => {
        window.open('https://ricebook-ct100-33acd3c66081.herokuapp.com/auth/google/login', '_self');
    }

    return (
        <div className="main-container">
            <style>{'body { background-color: rgb(242, 244, 247); }'}</style>
            <div className="title"><b>Ricebook</b></div>
            <div className="login-form">
                <div className="input-container">
                    <Typography variant="h7">{"Log Into Ricebook"}</Typography>
                </div>
                <div className="input-container">
                    <TextField 
                        className="input-field" 
                        size="medium"
                        label="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field" 
                        size="medium"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    ></TextField>
                    <Button 
                        variant="contained" 
                        style={{width: '90%', height: '50px', borderRadius: '5px', marginBottom: '10px'}}
                        onClick={login}
                    >
                        <b style={{fontSize: "19px", textTransform: 'none'}}>Log In</b>
                    </Button>
                    <Button
                        variant="outlined"
                        style={{width: '90%', height: '50px', borderRadius: '5px', marginBottom: '10px'}}
                        onClick={googleLogin}
                    >   
                        <GoogleIcon style={{marginRight: '10px'}}/>
                        Login with Google
                    </Button>
                    {showErrMsg ? <Alert 
                                    severity="error" onClose={() => {
                                        setShowErrMsg(false);
                                        setErrMsg('');
                                    }} 
                                    style={{marginLeft: '15px', marginRight: '15px'}}
                                  >
                                    {errMsg}
                                  </Alert> : <></>
                    }
                </div>
                <Divider variant="middle"><a style={{color: "gray"}}>or</a></Divider>
                <div className="input-container">
                    <Button 
                        variant="contained" 
                        className="button2" 
                        onClick={() => {
                            navigate('/register');
                        }}
                    >
                        <b>Create New Account</b>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Auth;