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

function SetupFindings() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState();
    const [formValue , setFormValue] = useState({
        IDPatient : 0,
        IDUser : 0,
        PatientName : "",
        PatientLastName : "",
        BirthDate : false,
        Gender : ""
    })
    const url = 'http://127.0.0.1:5000/api/v1/analysispatient';
    const [rowData, setRowData] = useState();
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'PatientName', headerName: 'Patient Name', width: 200 },
        { field: 'PatientLastName', headerName: 'Patient LastName', width: 200 },
        { field: 'BirthDate', headerName: 'BirthDate', width: 150 },
        { field: 'Gender', headerName: 'Gender', width: 100 }
      ]);
    const handleClose = () => setOpen(false);
    const [rowSystems, setRowSystems] = useState();
    const [Action, setAction] = useState(0);

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleOpenNew = () => { 
        setAction(0);
        setFormValue({IDPatient : 0, IDUser : 0, PatientName : "", PatientLastName : "", BirthDate : false, Gender : "" });
        setOpen(true);
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setFormValue({IDPatient : rowDataEdi.IDPatient, IDUser : 0, PatientName : rowDataEdi.PatientName, PatientLastName : rowDataEdi.PatientLastName, BirthDate : rowDataEdi.BirthDate, Gender : rowDataEdi.Gender });
            setOpen(true);
        }
    }    
    const UpdateData = async () =>  {
        try {
            const data = await fetch(url);
            const data1 = await data.json();
            setRowData(JSON.parse(data1).filter(i=> i.IDUser == cookies.get('IDUser')));
        } catch (error) {
           console.log(error); 
        }
    }
    const handleChange = (e) => {
        const {id , value} = e.target   
        setFormValue(prevState => ({
            ...prevState,
            [id] : value
            })
        )
    }
    const CU = async ()=> {
        await fetch(url, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDPatient": Action,
                "IDUser": cookies.get('IDUser'),
                "PatientName": formValue.PatientName,
                "PatientLastName": formValue.PatientLastName,
                "BirthDate": formValue.BirthDate,
                "Gender": formValue.Gender,
                "Lenguage":"ENG"
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
                        <TextField onChange={handleChange} value={formValue.PatientName} margin="normal" fullWidth id="PatientName" label="PatientName" name="PatientName"/>
                        <TextField onChange={handleChange} value={formValue.PatientLastName} margin="normal" fullWidth id="PatientLastName" label="PatientLastName" name="PatientLastName"/>
                        <TextField type="date" onChange={e => setFormValue(prevState => ({...prevState, ['BirthDate'] : e.target.value }))} value={formValue.BirthDate} margin="normal" fullWidth id="BirthDate" name="BirthDate"/>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formValue.Gender}
                            label="Gender"
                            onChange={e => setFormValue(prevState => ({...prevState, ['Gender'] : e.target.value }))}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="M">Men</MenuItem>
                                <MenuItem value="W">Womman</MenuItem>
                            </Select>
                        </FormControl>
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