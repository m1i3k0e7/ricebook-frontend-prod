import { useState, useEffect } from "react";
import { TextField, Typography, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import "./registeration.css"
import { useDispatch } from "react-redux";
import { userRegister } from "../authAction";

function calculateAge(birthday) {
    if (!birthday) return false;
    const today = new Date();
    const [year, month, day] = birthday;
    const age = today.getFullYear() - year;
    const monthComp = today.getMonth() - month;
    const younger = (monthComp < 0 || (monthComp == 0 && today.getDate() < day));
    return age - (younger ? 1 : 0) >= 18;
}

function Registeration() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthday, setBirthday] = useState([]);
    const [email, setEmail] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showErrMsg, setShowErrMsg] = useState(false);
    const [timestamp, setTimestamp] = useState("");
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    var validate = () => {
        const usernamePattern = /^[A-Za-z][A-Za-z0-9]*$/;
        const phoneNumberPattern = /^\d{10}$/;
        const emailPattern = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
        const zipcodePattern = /^\d{5,6}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
        if (name === '') {
            setErrMsg('Please input your name.');
            return false;
        } else if (!usernamePattern.test(username)) {
            setErrMsg('Please input a valid username: must start with letter and can only contain letters and numbers, e.g., test123.');
            return false;
        } else if (!phoneNumberPattern.test(phoneNumber)) {
            setErrMsg('Please input a valid phone number, e.g., 1234567890.');
            return false;
        } else if (!calculateAge(birthday)) {
            setErrMsg('Only individuals 18 years of age or older are allowed to register.');
            return false;
        } else if (!emailPattern.test(email)) {
            setErrMsg('please input a valid email, e.g., test@ricebook.com');
            return false;
        } else if (!zipcodePattern.test(zipcode)) {
            setErrMsg('please input a valid zipcode, e.g., 12345.');
            return false;
        } else if (!passwordPattern.test(password)) {
            setErrMsg('Invalid password: must contain at least an uppercase letter, a lowercase letter, a number, and a special character (@, $, !, %, *, ?, &, #, ^). The minimal length of your password should be 8.');
            return false;
        } else if (password !== passwordConfirm) {
            setErrMsg('Password confirmation should be the same as password.');
            return false;
        }

        return true;
    }

    const register = async () => {
        if (!validate()) {
            setShowErrMsg(true);
            return;
        }

        const registerRes = await dispatch(userRegister({username, email, birthday, phoneNumber, zipcode, password}));
        
        if (registerRes.payload === 'success') {
            setTimestamp(Date.now());
            navigate('/');
        } else {
            setErrMsg(registerRes.payload);
            setShowErrMsg(true);
        }
    }

    return (
        <div className="main-container-r">
            <style>{'body { background-color: rgb(242, 244, 247); }'}</style>
            <div className="title-r"><b>Ricebook</b></div>
            <div className="login-form-r">
                <div className="input-container-r">
                    <b style={{fontSize: '25px'}}>Create a New Account</b><br></br>
                </div>
                <Divider style={{padding: '5px'}}/>
                <div className="input-container-r">
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        label="Name"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        label="Username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        label="Phone Number"
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        label="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    ></TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            className="input-field-r" 
                            size="medium"
                            label="Birthday"
                            onChange={(newValue) => {
                                setBirthday([newValue.$y, newValue.$M, newValue.$D]);
                            }}
                        />
                    </LocalizationProvider>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        label="Zipcode"
                        onChange={(e) => {
                            setZipcode(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        type="password"
                        label="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    ></TextField>
                    <TextField 
                        className="input-field-r" 
                        size="medium"
                        type="password"
                        label="Password Confirmation"
                        onChange={(e) => {
                            setPasswordConfirm(e.target.value);
                        }}
                    ></TextField>
                    <input type="hidden" id="timestamp" name="timestamp" value={timestamp} />
                    {showErrMsg ? <Alert 
                                    severity="error" onClose={() => {
                                        setShowErrMsg(false);
                                        setErrMsg('');
                                    }} 
                                    style={{marginLeft: '15px', marginRight: '15px', textAlign: 'left'}}
                                  >
                                    {errMsg}
                                  </Alert> : <></>}
                </div>
                <div className="temp-r">
                    <Button variant="contained" className="button2-r" onClick={register}><b>Sign up</b></Button>
                </div>
                <div className="input-container-r" style={{paddingTop: '15px', fontSize: '17px'}}>
                    <Link to={'/'} className="have-account-r">Already have an account?</Link>
                </div>
            </div>
        </div>
    );
}

export default Registeration;