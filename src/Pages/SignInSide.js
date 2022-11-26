import React, {useState , CSSProperties } from 'react';
import {ClockLoader, RingLoader , BounceLoader } from "react-spinners";
import md5 from 'md5';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { NavLink, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import img from './img/test.jpg'

const theme = createTheme();
const cookies = new Cookies();

export default function SignInSide() {
  let [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [state , setState] = useState({
      User : "",
      Password : ""
  })

  const handleChange = (e) => {
      const {id , value} = e.target   
      setState(prevState => ({
          ...prevState,
          [id] : value
          })
      )
  }
  const iniciarSesion = async ()=> {
    setLoading(true);
    //swal("Clave incorrecta");
    // console.log(md5(state.Password));
    await fetch('/api/user/login/', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
        "user": state.User,
        "userPassword": md5(state.Password)
      }])
     })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson['msj'] == 'Accion no fue Completada'){
        setLoading(false);
        swal('Usuario no encontrado');
      }else{
        // console.log(responseJson);
        if(responseJson.status == "1"){
          cookies.set('IDUser', responseJson.id, {path: "/"});
          cookies.set('IDTypeUser', responseJson.typeuser, {path: "/"});
          cookies.set('UserName', responseJson.username, {path: "/"});
          cookies.set('Status', responseJson.status, {path: "/"});
          cookies.set('User', responseJson.User, {path: "/"});
          cookies.set('UserLenguage', responseJson.userlenguage, {path: "/"});
          cookies.set('UserMail', responseJson.usermail, {path: "/"});
          cookies.set('UserLastName', responseJson.userlastname, {path: "/"});
          cookies.set('UserPhone', responseJson.userphone, {path: "/"});
          navigate('/Main');
        }else{
          swal("El usuario no esta activo")
        }
      }
      
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
                    <Avatar sx={{ width: 80, height: 80, m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField onChange={handleChange} margin="normal" required fullWidth id="User" label="User" name="User" autoComplete="User" autoFocus />
                        <TextField onChange={handleChange} margin="normal" required fullWidth name="Password" label="Password" type="Password" id="Password" autoComplete="current-password" />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                        <Button onClick={iniciarSesion} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                          Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">Forgot password?</Link>
                            </Grid>
                            <Grid item>
                                <NavLink to={"/NewAccountSide"} variant="body2">{"Don't have an account? Sign Up"}</NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                    <RingLoader color="#36d7b7" loading={loading} size={100} />
                </Box>
            </Grid>
        </Grid>
    </ThemeProvider>
  );
}