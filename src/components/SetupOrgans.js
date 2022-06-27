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

function SetupOrgans() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState();
    const [formValue , setFormValue] = useState({
        IDSetupSystems : 0,
        BodyOrgans : "",
        Left : true,
        Right : true,
        Men : true,
        Womman : true,
        RangeMax : 0,
        RangeMin : 0
    })
    const url = 'http://127.0.0.1:5000/api/v1/bodyorgans';
    const [rowData, setRowData] = useState();
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'SetupSystems', headerName: 'Setup Systems', width: 200 },
        { field: 'BodyOrgans', headerName: 'Setup Body Organs', width: 200 },
        { field: 'Left', headerName: 'Left', width: 125 },
        { field: 'Right', headerName: 'Right', width: 125 },
        { field: 'Men', headerName: 'Men', width: 125 },
        { field: 'Womman', headerName: 'Womman', width: 125 },
        { field: 'RangeMax', headerName: 'Range Max', width: 125 },
        { field: 'RangeMin', headerName: 'Range Min', width: 125 },
        { field: 'Lenguage', headerName: 'Lenguage', width: 150 },
      ]);
    const handleClose = () => setOpen(false);
    const url2 = 'http://127.0.0.1:5000/api/v1/systems';
    const [rowSystems, setRowSystems] = useState();
    const [Action, setAction] = useState(0);
    const [Lista, setLista] = useState();

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleOpenNew = () => { 
        setAction(0);
        setFormValue({IDSetupSystems : 0, BodyOrgans : "", Left : false, Right : false, Men : false, Womman : false, RangeMax : 0, RangeMin : 0 });
        setOpen(true);
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setFormValue({IDSetupSystems:rowDataEdi.IDSetupSystems, BodyOrgans:rowDataEdi.BodyOrgans, Left : rowDataEdi.Left, Right : rowDataEdi.Right, Men : rowDataEdi.Men, Womman : rowDataEdi.Womman, RangeMax:rowDataEdi.RangeMax, RangeMin:rowDataEdi.RangeMin });
            setOpen(true);
        }
    }    
    const UpdateData = async () =>  {
        try {
            const data = await fetch(url);
            const data1 = await data.json();
            setRowData(JSON.parse(data1));
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
    const UpdateSystems = async () =>  {
        try {
            const data = await fetch(url2);
            const data1 = await data.json();
            setRowSystems(JSON.parse(data1));
        } catch (error) {
           console.log(error); 
        }
    }
    const CU = async ()=> {
        await fetch(url, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDSetupBodyOrgans": Action,
                "IDSetupSystems": formValue.IDSetupSystems,
                "BodyOrgans": formValue.BodyOrgans,
                "Left": formValue.Left,
                "Right": formValue.Right,
                "Men": formValue.Men,
                "Womman": formValue.Womman,
                "RangeMax": formValue.RangeMax,
                "RangeMin": formValue.RangeMin,
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
    useEffect(() => {
        UpdateSystems();
    }, []);
    useEffect(() => {
        if(rowSystems){
            const x = 
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Systems</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValue.IDSetupSystems}
                label="Systems"
                onChange={e => setFormValue(prevState => ({...prevState, ['IDSetupSystems'] : e.target.value }))}
                >
                    <MenuItem value={0}><em>None</em></MenuItem>
                    {rowSystems.map((x) => <MenuItem value={x['id']} key={x['id']} >{x['SetupSystems']}</MenuItem>)}
                </Select>
            </FormControl>
            setLista(x);
        }
    }, [formValue]);

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
                <Typography component="h1" variant="h5">Body Organs</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        {Lista}
                        <TextField onChange={handleChange} value={formValue.BodyOrgans} margin="normal" fullWidth id="BodyOrgans" label="BodyOrgans" name="BodyOrgans"/>
                        <FormControlLabel control={<Checkbox onChange={e =>  setFormValue(prevState => ({...prevState, ['Left'] : e.target.checked }))} checked={formValue.Left} name='Left' id='Left' />} label="Left" />
                        <FormControlLabel control={<Checkbox onChange={e =>  setFormValue(prevState => ({...prevState, ['Right'] : e.target.checked }))} checked={formValue.Right} name='Right' id='Right' />} label="Right" />
                        <FormControlLabel control={<Checkbox onChange={e =>  setFormValue(prevState => ({...prevState, ['Men'] : e.target.checked }))} checked={formValue.Men} name='Men' id='Men' />} label="Men" />
                        <FormControlLabel control={<Checkbox onChange={e =>  setFormValue(prevState => ({...prevState, ['Womman'] : e.target.checked }))} checked={formValue.Womman} name='Womman' id='Womman' />} label="Womman" />
                        <TextField onChange={handleChange} value={formValue.RangeMax} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMax" label="RangeMax" name="RangeMax"/>
                        <TextField onChange={handleChange} value={formValue.RangeMin} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth id="RangeMin" label="RangeMin" name="RangeMin"/>
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

export default SetupOrgans