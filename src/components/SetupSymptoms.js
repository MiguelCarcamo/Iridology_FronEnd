import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import swal from 'sweetalert';

function SetupSymptoms() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState();
    const [BodyOrgans, setBodyOrgans] = useState(null);
    const [Symptoms, setSymptoms] = useState("");
    const [RangeMax, setRangeMax] = useState(0);
    const [RangeMin, setRangeMin] = useState(0);
    const url = '/api/SetupSymptoms/';
    const url3 = '/api/SetupSymptoms/add';
    const url4 = '/api/SetupSymptoms/update';
    const [rowData, setRowData] = useState();
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'SetupBodyOrgans', headerName: 'Setup Body Organs', width: 150 },
        { field: 'Symptoms', headerName: 'Symptoms', width: 400 },
        { field: 'RangeMax', headerName: 'Range Max', width: 100 },
        { field: 'RangeMin', headerName: 'Range Min', width: 100 },
        { field: 'Lenguage', headerName: 'Lenguage', width: 75 },
      ]);
    const handleClose = () => setOpen(false);
    const url2 = '/api/SetupBodyOrgans/';
    const [rowBodyOrgans, setRowBodyOrgans] = useState();
    const [Action, setAction] = useState(0);
    const [Lista, setLista] = useState();

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleOpenNew = () => { 
        setAction(0);
        setBodyOrgans(null);
        setSymptoms("");
        setRangeMax(0);
        setRangeMin(0);
        setOpen(true);
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setBodyOrgans(rowDataEdi.IDSetupBodyOrgans+'-'+rowDataEdi.SetupBodyOrgans);
            setSymptoms(rowDataEdi.Symptoms);
            setRangeMax(rowDataEdi.RangeMax);
            setRangeMin(rowDataEdi.RangeMin);
            setOpen(true);
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
    const UpdateBodyOrgans = async () =>  {
        try {
            const data = await fetch(url2);
            const data1 = await data.json();
            setRowBodyOrgans(data1);
        } catch (error) {
           console.log(error); 
        }
    }
    const CU = async ()=> {
        await fetch((Action==0)?url3:url4, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDSetupSymptoms": Action,
                "IDSetupBodyOrgans": BodyOrgans.split('-')[0],
                "Symptoms": Symptoms,
                "RangeMax": RangeMax,
                "RangeMin": RangeMin,
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
    const EnviarDatos2 = async () => {
        var url = '/api/SetupSymptoms/delete'
        const data = await fetch(url, {
          method: 'delete',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify([{
                  "IDSetupSymptoms": rowDataEdi.id
              }])
          }
        );
      } 
    const handleOpenDelete = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this file!",
                icon: "warning",
                buttons: [
                  'No, cancel it!',
                  'Yes, I am sure!'
                ],
                dangerMode: true,
              }).then(function(isConfirm) {
                if (isConfirm) {
                  EnviarDatos2();
                  swal({
                    title: 'Shortlisted!',
                    text: 'Candidates are successfully shortlisted!',
                    icon: 'success'
                  }).then(function() {
                    UpdateData();
                  });
                } else {
                  swal("Complete", "Your file is safe :)", "success");
                }
              })
        }
    }

    // EN ESTA SECCION CONTIENE TODAS LAS USEEFFECT QUE REQUERIMOS PARA EL FUNCIONAMIENTO
    useEffect(() => {
        const run = async () =>
            await UpdateData();
        run();
    }, []);
    useEffect(() => {
        const run = async () =>
            await UpdateBodyOrgans();
        run();
    }, []);
    return (
        <div style={{ height: 625, width: '100%' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={handleOpenNew} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
                <Button onClick={handleOpenUpdate} startIcon={<RefreshIcon />} > Update</Button>
                <Button onClick={handleOpenDelete} color="error" startIcon={<DeleteForeverIcon />} > Delete</Button>
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
                <Box
                    sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                <Typography component="h1" variant="h5">Symptoms</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <Autocomplete
                            id="free-solo-demo"
                            onChange={(event, newValue) => {
                                setBodyOrgans(newValue);
                            }}
                            value={BodyOrgans}
                            options={(rowBodyOrgans)?rowBodyOrgans.map((option) =>option.id + '-' + option.BodyOrgans):[]}
                            renderInput={(params) => <TextField {...params} label="Body Organs" />}
                        />
                        <TextField multiline value={Symptoms} onChange={e => setSymptoms(e.target.value)} margin="normal" fullWidth id="Symptoms" label="Symptoms" name="Symptoms"/>
                        <TextField value={RangeMax} onChange={e => setRangeMax(e.target.value)} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMax" label="RangeMax" name="RangeMax"/>
                        <TextField value={RangeMin} onChange={e => setRangeMin(e.target.value)} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMin" label="RangeMin" name="RangeMin"/>
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

export default SetupSymptoms