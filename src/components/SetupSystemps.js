import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

function SetupSystemps() {
    const url = 'http://127.0.0.1:5000/api/v1/systems';
    const [open, setOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [Action, setAction] = useState(0);
    const [formValue , setFormValue] = useState({
        Systems : "",
        RangeMax : 0,
        RangeMin : 0
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setFormValue(prevState => ({
            ...prevState,
            [id] : value
            })
        )
    }
    const handleOpenN = () => {
                                setOpen(true);
                                setAction(0);
                                setFormValue({Systems:"", RangeMax:"", RangeMin:"" });
                            }
    const handleOpenU = () => {
                                if (!rowDataEdi.id){
                                    swal("¡Debe seleccionar un campo!")
                                }else{
                                    setOpen(true);
                                    setAction(rowDataEdi.id);
                                    setFormValue({Systems:rowDataEdi.SetupSystems, RangeMax:rowDataEdi.RangeMax, RangeMin:rowDataEdi.RangeMin });
                                }
                            }
    const handleClose = () => setOpen(false);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'SetupSystems', headerName: 'Setup Systems', width: 350 },
        { field: 'RangeMax', headerName: 'Range Max', width: 125 },
        { field: 'RangeMin', headerName: 'Range Min', width: 125 },
        { field: 'Lenguage', headerName: 'Lenguage', width: 150 },
      ]);
    
    const UpdateData = async () =>  {
        await fetch(url)
        .then(result => result.json())
        .then(rowData => setRowData( JSON.parse(rowData) ) )
    }
    const Create = async ()=> {
        await fetch('http://127.0.0.1:5000/api/v1/systems', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "SetupSystems": formValue.Systems,
                "RangeMax": formValue.RangeMax,
                "RangeMin": formValue.RangeMin,
                "Lenguage": "ENG"
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
    const update = async ()=> {
        await fetch('http://127.0.0.1:5000/api/v1/systems', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDSetupSystems" : Action,
                "SetupSystems": formValue.Systems,
                "RangeMax": formValue.RangeMax,
                "RangeMin": formValue.RangeMin,
                "Lenguage": "ENG"
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
    useEffect(() => {
        UpdateData();
    }, []);
    
    return (
        <div style={{ height: 625, width: '100%' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={handleOpenN} variant="contained" color="success" startIcon={<AddIcon />}  > New</Button>
                <Button onClick={handleOpenU} startIcon={<RefreshIcon />} > Update</Button>
            </ButtonGroup>
            {rowData.length > 0 ?
                <DataGrid 
                    style={{ height: 550, width: '100%' }} 
                    rows={rowData} 
                    columns={columns}
                    onRowClick={(x)=> setRowDataEdi(x.row)}
                />
            : false}
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
                        <Typography component="h1" variant="h5">Systemps</Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                        
                            <TextField onChange={handleChange} value={formValue.Systems} margin="normal" fullWidth id="Systems" label="Systems" name="Systems"/>
                            <TextField onChange={handleChange} value={formValue.RangeMax} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMax" label="RangeMax" name="RangeMax"/>
                            <TextField onChange={handleChange} value={formValue.RangeMin} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMin" label="RangeMin" name="RangeMin"/>
                            <FormControlLabel disabled control={<Checkbox defaultChecked />} label="English" />
                            {(Action==0) ?
                            <Button onClick={Create} fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }} >Create</Button>                            
                            :
                            <Button onClick={update} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} >Update</Button> 
                            }
                        </Box>
                    </Box>
                </Grid>
            </Dialog>
        </div>
    )
}

export default SetupSystemps