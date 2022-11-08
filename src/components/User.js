import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import md5 from 'md5';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import swal from 'sweetalert';

function User() {
    const [rowDataEdi, setRowDataEdi] = useState(false);
    const [rowData, setRowData] = useState();
    const [rowDisplay, setDisplay] = useState();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [Action, setAction] = useState(0);
    const [Name, setName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [PasswordOld, setPasswordOld] = useState("");
    const [Country, setCountry] = useState("");
    const [Phone, setPhone] = useState("");
    const [TypeUser, setTypeUser] = useState("");
    const [Status, setStatus] = useState("1");
    const url = 'https://iridologyapirest.herokuapp.com/api/user/';
    const url3 = 'https://iridologyapirest.herokuapp.com/api/user/add';
    const url4 = 'https://iridologyapirest.herokuapp.com/api/user/update/';
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'typeuser', headerName: 'TypeUser', width: 160 },
        { field: 'status', headerName: 'Status', width: 110 },
        { field: 'username', headerName: 'Name', width: 150 },
        { field: 'userlastname', headerName: 'LastName', width: 150 },
        { field: 'User', headerName: 'User', width: 150 },
        { field: 'usermail', headerName: 'Mail', width: 250 },
        { field: 'userphone', headerName: 'Phone', width: 100 },
        { field: 'userlenguage', headerName: 'Lenguage', width: 150 },
        ]);


    const handleClose = () => setOpen(false);
    const handleClose2 = () => setOpen2(false);
    const handleOpenNew = () => { 
        setOpen(true);
        setAction(0);
        setName("");
        setLastName("");
        setEmail("");
        setCountry("");
        setPhone("");
        setTypeUser("2");
        setPasswordOld("1234");
        setPassword("1234");
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setName(rowDataEdi.username);
            setLastName(rowDataEdi.userlastname);
            setEmail(rowDataEdi.usermail);
            setCountry(rowDataEdi.usercountry);
            setPhone(rowDataEdi.userphone);
            setPasswordOld(rowDataEdi.Password);
            setTypeUser(rowDataEdi.idtypeuser);
            setOpen(true);
        }
    }
    const handleOpenUpdate2 = () => {
        if (!rowDataEdi){
            swal("¡Debe seleccionar un campo!")
        }else{
            setOpen2(true);
        }
    }
    const UpdateData = async () =>  {
        try {
            const data = await fetch(url);
            const data1 = await data.json();
            setRowData(data1);
        } catch (error) {
            console.log(error); 
        }
    }
    const UpdateDisplay = async () =>  {
        try {
            if(rowDataEdi){
                const data = await fetch("https://iridologyapirest.herokuapp.com/api/user/Display/" + rowDataEdi.id);
                const data1 = await data.json();
                setDisplay(data1);
            }
        } catch (error) {
            console.log(error); 
        }
    }

    const CU = async ()=> {
        await fetch((Action==0)?url3:url4, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "idinfouser": Action,
                "userPassword": md5(Password),
                "TypeUser": TypeUser,
                "UserName": Name,
                "UserLastName": LastName,
                "UserMail": Email,
                "UserPhone": Phone,
                "UserCountry": Country,
                "Status": Status,
                "UserLenguage": "ENG"
            }])
        })
       .then((response) => response.json())
       .then((responseJson) => {
            swal(responseJson['msj']);
            if(responseJson['msj'] == 'Accion Realizada Correctamente'){
                handleClose();
                UpdateData();
            }
       });
    }

    const PrepareData = async (id, value) => {
        // console.log(id.split('-')[0]);
        // console.log(value);
        await fetch('https://iridologyapirest.herokuapp.com/api/user/Display/', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "id": id.split('-')[0],
                "access": value
            }])
        })
       .then((response) => response.json())
       .then((responseJson) => {
            swal(responseJson['msj']);
       });
    }

    // EN ESTA SECCION CONTIENE TODAS LAS USEEFFECT QUE REQUERIMOS PARA EL FUNCIONAMIENTO
    useEffect(() => {
        const run = async () =>
            await UpdateData();
        run();
    }, []);
    // EN ESTA SECCION CONTIENE TODAS LAS USEEFFECT QUE REQUERIMOS PARA EL FUNCIONAMIENTO
    useEffect(() => {
        const run = async () =>
            await UpdateDisplay();
        run();
    }, [rowDataEdi]);
  return (
    <div style={{ height: 625, width: '100%' }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={handleOpenNew} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
            <Button onClick={handleOpenUpdate} startIcon={<RefreshIcon />} > Update</Button>
            <Button onClick={handleOpenUpdate2} color="warning" startIcon={<RemoveRedEyeOutlinedIcon />} > Access</Button>
        </ButtonGroup>
        {rowData?
        <DataGrid 
            style={{ height: 550, width: '100%' }} 
            rows={rowData} 
            columns={columns}
            onRowClick={(x)=> setRowDataEdi(x.row)}
        />
        : false}
        <Dialog open={open} onClose={handleClose} >
            <Grid component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',}} >
                    <Typography component="h1" variant="h5">User</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField value={Name} onChange={e => setName(e.target.value)} margin="normal" required fullWidth id="Name" label="Name" name="Name" autoComplete="Name" autoFocus />
                        <TextField value={LastName} onChange={e => setLastName(e.target.value)} margin="normal" required fullWidth id="LastName" label="LastName" name="LastName" autoComplete="LastName" />
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Type User</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={TypeUser}
                                onChange={e => setTypeUser(e.target.value)} 
                            >
                                <FormControlLabel value={3} control={<Radio color="secondary" />} label="Admin General" />
                                <FormControlLabel value={2} control={<Radio />} label="Admin" />
                                <FormControlLabel value={1} control={<Radio color="success" />} label="Invitado" />
                            </RadioGroup>
                        </FormControl>
                        <TextField value={Email} onChange={e => setEmail(e.target.value)} margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                        <TextField value={Country} onChange={e => setCountry(e.target.value)} margin="normal" required fullWidth id="Country" label="Country" name="Country" autoComplete="Country" />
                        <TextField value={Phone} onChange={e => setPhone(e.target.value)} margin="normal" required fullWidth id="Phone" label="Phone" name="Phone" autoComplete="Phone" />
                        <FormControlLabel disabled control={<Checkbox defaultChecked />} label="English" />
                        <FormControlLabel onChange={(e) => e.target.checked? setPassword("1234"):setPassword(PasswordOld)} control={<Checkbox />} label="Reset Password" />
                        <FormControlLabel onChange={(e) => e.target.checked? setStatus("1"):setStatus("0")} control={<Checkbox defaultChecked />} label="Activo" />
                        {(Action==0) ?
                        <Button onClick={CU} fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }} >Create</Button>                            
                        :
                        <Button onClick={CU} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} >Update</Button> 
                        }
                    </Box>
                </Box>
            </Grid>
        </Dialog>
        <Dialog open={open2} onClose={handleClose2} >
            <Grid component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',}} >
                    <Typography component="h1" variant="h5">Access Displays</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <FormGroup>
                            {rowDisplay?
                            rowDisplay.map((i) => 
                            <FormControlLabel key={i.id} control={<Switch name={i.id+'-'+i.namedisplay} onChange={(e)=> PrepareData(e.target.name, e.target.checked)} color="error" defaultChecked={i.access} />} label={i.namedisplay} />
                            )
                            :false}
                        </FormGroup>
                    </Box>
                </Box>
            </Grid>
        </Dialog>
    </div>
  )
}

export default User