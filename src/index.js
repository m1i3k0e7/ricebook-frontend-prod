import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Auth from './auth/auth';
import Registeration from './auth/registeration/registeration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from './main/main';
import { Provider } from 'react-redux';
import store from './app/store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Profile from './profile/profile';


const theme = createTheme({
  typography: {
    button: {
      color: 'rgb(96, 98, 102)',
      textTransform: 'none'
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Auth />}/>
            <Route exact path="/register" element={<Registeration />}/>
            <Route exact path='/main' element={<Main />}/>
            <Route exact path='/profile' element={<Profile />}/>
          </Routes>
        </Router>
      </Provider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
