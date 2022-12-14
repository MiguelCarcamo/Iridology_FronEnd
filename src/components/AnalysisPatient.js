import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import swal from 'sweetalert';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const fecha = new Date();

function SetupFindings() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState();

    const [IDPatient, setIDPatient] = useState();
    const [IDUser, setIDUser] = useState();
    const [PatientName, setPatientName] = useState();
    const [PatientLastName, setPatientLastName] = useState();
    const [BirthDate, setBirthDate] = useState();
    const [Gender, setGender] = useState();
    const [Weight, setWeight] = useState();

    const url = 'https://iridologo.org/api/AnalysisPatient/';
    const url2 = 'https://iridologo.org/api/AnalysisPatient/add';
    const url3 = 'https://iridologo.org/api/AnalysisPatient/update';
    const [rowData, setRowData] = useState();
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'PatientName', headerName: 'Patient Name', width: 200 },
        { field: 'PatientLastName', headerName: 'Patient LastName', width: 200 },
        { field: 'BirthDate', headerName: 'BirthDate', width: 250 },
        { field: 'Gender', headerName: 'Gender', width: 100 },
        { field: 'Weight', headerName: 'Weight', width: 100 }
      ]);
    const handleClose = () => setOpen(false);
    const [rowSystems, setRowSystems] = useState();
    const [Action, setAction] = useState(0);

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleOpenNew = () => { 
        setAction(0);
        setIDPatient(0);
        setIDUser(0);
        setPatientName("");
        setPatientLastName("");
        setBirthDate(false);
        setGender("");
        setWeight(0);
        setOpen(true);
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setIDPatient(rowDataEdi.IDPatient);
            setIDUser(0);
            setPatientName(rowDataEdi.PatientName);
            setPatientLastName(rowDataEdi.PatientLastName);
            var date = new Date(rowDataEdi.BirthDate),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            var x = [date.getFullYear(), mnth, day].join("-");
            setBirthDate(x);
            setGender(rowDataEdi.Gender);
            setWeight(rowDataEdi.Weight);
            setOpen(true);
        }
    }    
    const UpdateData = async () =>  {
        try {
            const data = await fetch(url);
            const data1 = await data.json();
            setRowData(data1.filter(i=> i.IDUser == cookies.get('IDUser')));
        } catch (error) {
           console.log(error); 
        }
    }
    const CU = async ()=> {
        await fetch((Action==0)?url2:url3, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDPatient": Action,
                "IDUser": cookies.get('IDUser'),
                "PatientName": PatientName,
                "PatientLastName": PatientLastName,
                "BirthDate": BirthDate,
                "Gender": Gender,
                "Lenguage":"ENG",
                "Weight": Weight
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
    // EN ESTA SECCION CONTIENE TODAS LAS USEEFFECT QUE REQUERIMOS PARA EL FUNCIONAMIENTO
    useEffect(() => {
        const run = async () =>
            await UpdateData();
        run();
    }, []);
    useEffect(() => {
        if(rowData){
            const x = <DataGrid style={{ height: 550, width: '100%' }} rows={rowData} columns={columns}onRowClick={(x)=> setRowDataEdi(x.row)} />
            setTable(x);
        }
    }, [rowData]);
    return (
        <div style={{ height: 625, width: '100%' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={handleOpenNew} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
                <Button onClick={handleOpenUpdate} startIcon={<RefreshIcon />} > Update</Button>
            </ButtonGroup>
            {table}
            <Dialog open={open} onClose={handleClose} >
            <Grid component={Paper} elevation={6} square>
                <Box
                    sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                <Typography component="h1" variant="h5">New Patient</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField value={PatientName} onChange={e => setPatientName(e.target.value)} margin="normal" fullWidth id="PatientName" label="PatientName" name="PatientName"/>
                        <TextField value={PatientLastName} onChange={e => setPatientLastName(e.target.value)} margin="normal" fullWidth id="PatientLastName" label="PatientLastName" name="PatientLastName"/>
                        <TextField value={BirthDate} onChange={e => setBirthDate(e.target.value)} type="date" margin="normal" fullWidth id="BirthDate" name="BirthDate"/>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={Gender} 
                            onChange={e => setGender(e.target.value)}
                            label="Gender"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="M">Men</MenuItem>
                                <MenuItem value="W">Womman</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField value={Weight} onChange={e => setWeight(e.target.value)} inputProps={{max: 1000, min:1}} type="number" margin="normal" fullWidth id="Weight" label="Weight" name="Weight"/>
                        <FormControlLabel disabled control={<Checkbox defaultChecked />} label="English" />
                        {(Action==0) ?
                        <Button onClick={CU} fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }} >Create</Button>                            
                        :
                        <Button onClick={CU} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} >Update</Button> 
                        }
                    </Box>
                </Box>
            </Grid>
        </Dialog>
        </div>
    )
}

export default SetupFindings