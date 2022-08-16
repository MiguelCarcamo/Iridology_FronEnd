import React, { useState } from "react";
import md5 from 'md5';
import swal from 'sweetalert';
import { NavLink, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import img from './img/test.jpg'

const theme = createTheme();

export default function NewAccountSide() {
    const navigate = useNavigate();

    const [state , setState] = useState({
        Name : "",
        LastName : "",
        email : "",
        Password : "",
        Country : "",
        Phone : ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
            })
        )
    }
    const CreateAccount = async ()=> {
        await fetch('https://iridologyapirest.herokuapp.com/api/user/add', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "userPassword": md5(state.Password),
                "TypeUser": 1,
                "UserName": state.Name,
                "UserLastName": state.LastName,
                "UserMail": state.email,
                "UserPhone": state.Phone,
                "UserCountry": state.Country,
                "UserLenguage": "ENG"
            }])
        })
       .then((response) => response.json())
       .then((responseJson) => {
            swal(responseJson['msj']);
            if(responseJson['msj'] == 'Accion Realizada Correctamente')
                navigate('/');
       });
    }
  return (
    <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
        <Grid
          item
          xs={false}
          sm={3}
          md={8}
          sx={{
            backgroundImage: 'url(' + img + ')',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
            <Grid item xs={12} sm={9} md={4} component={Paper} elevation={6} square>
                <Box
                    sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ width: 60, height: 60, m: 1, bgcolor: 'success.main' }}>
                        <AccountCircleIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography component="h1" variant="h5">New Account</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="Name" label="Name" name="Name" autoComplete="Name" autoFocus />
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="LastName" label="LastName" name="LastName" autoComplete="LastName" />
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                        <TextField onChange={handleChange} margin="normal" required fullWidth name="Password" label="Password" type="Password" id="Password" autoComplete="current-password" />
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="Country" label="Country" name="Country" autoComplete="Country" />
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="Phone" label="Phone" name="Phone" autoComplete="Phone" />
                        <FormControlLabel disabled control={<Checkbox defaultChecked />} label="English" />
                        <Button onClick={CreateAccount} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >Create</Button>
                        <Grid container>
                            <Grid item>
                                <NavLink to={"/"} variant="body2">{"Sign Up"}</NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </ThemeProvider>
  );
}