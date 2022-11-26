import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import swal from 'sweetalert';

function SetupRanges() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [rowData, setRowData] = useState();
    const [open, setOpen] = useState(false);
    const [SetupRange, setSetupRange] = useState("");
    const [RangeMax, setRangeMax] = useState(0);
    const [RangeMin, setRangeMin] = useState(0);
    const [Action, setAction] = useState(0);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'setuprange', headerName: 'Setup Range', width: 250 },
        { field: 'rangemin', headerName: 'Range Min', width: 100 },
        { field: 'rangemax', headerName: 'Range Max', width: 100 },
      ]);
    const url = '/api/SetupRange/';
    const url3 = '/api/SetupRange/add';
    const url4 = '/api/SetupRange/update';

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleClose = () => setOpen(false);
    const handleOpenNew = () => { 
        setAction(0);
        setSetupRange("");
        setRangeMax(0);
        setRangeMin(0);
        setOpen(true);
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setSetupRange(rowDataEdi.setuprange);
            setRangeMax(rowDataEdi.rangemax);
            setRangeMin(rowDataEdi.rangemin);
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

    const CU = async ()=> {
        await fetch((Action==0)?url3:url4, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "idsetuprange": Action,
                "setuprange": SetupRange,
                "RangeMax": RangeMax,
                "RangeMin": RangeMin
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

  return (
    <div style={{ height: 625, width: '55%' }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={handleOpenNew} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
            <Button onClick={handleOpenUpdate} startIcon={<RefreshIcon />} > Update</Button>
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
                <Typography component="h1" variant="h5">Setup Ranges</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField value={SetupRange} onChange={e => setSetupRange(e.target.value)} margin="normal" fullWidth id="SetupRange" label="SetupRange" name="SetupRange"/>
                        <TextField value={RangeMax} onChange={e => setRangeMax(e.target.value)} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMax" label="RangeMax" name="RangeMax"/>
                        <TextField value={RangeMin} onChange={e => setRangeMin(e.target.value)} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMin" label="RangeMin" name="RangeMin"/>
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

export default SetupRanges