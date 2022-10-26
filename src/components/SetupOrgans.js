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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import swal from 'sweetalert';

function SetupOrgans() {
    // EN ESTE BLOQUE ESTA TODA LAS VARIABLES REQUERIDAS
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [open, setOpen] = useState(false);
    const [table, setTable] = useState();
    //Con estas variables controlamos los datos que enviaremos a la base de datos
    const [Systems, setSystems] = useState(null);
    const [BodyOrgans, setBodyOrgans] = useState("");
    const [Left, setLeft] = useState(null);
    const [Right, setRight] = useState(null);
    const [Men, setMen] = useState(null);
    const [womman, setwomman] = useState(null);
    const [RangeMax, setRangeMax] = useState(0);
    const [RangeMin, setRangeMin] = useState(0);
    const [level, setLevel] = useState("High");

    const url = 'https://iridologyapirest.herokuapp.com/api/SetupBodyOrgans/';
    const url3 = 'https://iridologyapirest.herokuapp.com/api/SetupBodyOrgans/add';
    const url4 = 'https://iridologyapirest.herokuapp.com/api/SetupBodyOrgans/update';
    const [rowData, setRowData] = useState();
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'SetupSystems', headerName: 'Setup Systems', width: 200 },
        { field: 'BodyOrgans', headerName: 'Setup Body Organs', width: 200 },
        { field: 'importance_level', headerName: 'Importance Level', width: 150 },
        { field: 'Left', headerName: 'Left', width: 125 },
        { field: 'Right', headerName: 'Right', width: 125 },
        { field: 'Men', headerName: 'Men', width: 125 },
        { field: 'Womman', headerName: 'Womman', width: 125 },
        { field: 'RangeMax', headerName: 'Range Max', width: 125 },
        { field: 'RangeMin', headerName: 'Range Min', width: 125 },
        { field: 'Lenguage', headerName: 'Lenguage', width: 150 },
      ]);
    const handleClose = () => setOpen(false);
    const url2 = 'https://iridologyapirest.herokuapp.com/api/SetupSystems/';
    const [rowSystems, setRowSystems] = useState();
    const [Action, setAction] = useState(0);
    const [Lista, setLista] = useState();

    // EN ESTA SECCION SE CONTIENE TODAS LAS FUNCIONES
    const handleOpenNew = () => { 
        setAction(0);
        setSystems(null);
        setBodyOrgans("");
        setLeft(true);
        setRight(true);
        setMen(true);
        setwomman(true);
        setRangeMax(0);
        setRangeMin(0);
        setOpen(true);
        setLevel("High");
    }
    const handleOpenUpdate = () => { 
        if (!rowDataEdi.id){
            swal("¡Debe seleccionar un campo!")
        }else{
            setAction(rowDataEdi.id);
            setSystems(rowDataEdi.IDSetupSystems+'-'+rowDataEdi.SetupSystems);
            setBodyOrgans(rowDataEdi.BodyOrgans);
            setLeft((rowDataEdi.Left==1)?true:false);
            setRight((rowDataEdi.Right==1)?true:false);
            setMen((rowDataEdi.Men==1)?true:false);
            setwomman((rowDataEdi.Womman==1)?true:false);
            setRangeMax(rowDataEdi.RangeMax);
            setRangeMin(rowDataEdi.RangeMin);
            setLevel(rowDataEdi.importance_level);
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
    const UpdateSystems = async () =>  {
        try {
            const data = await fetch(url2);
            const data1 = await data.json();
            setRowSystems(data1)
        } catch (error) {
           console.log(error); 
        }
    }
    const CU = async ()=> {
        await fetch((Action==0)?url3:url4, {
            method: (Action==0)?'post':'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDSetupBodyOrgans": Action,
                "IDSetupSystems": Systems.split('-')[0],
                "BodyOrgans": BodyOrgans,
                "Left": (Left)?1:0,
                "Right": (Right)?1:0,
                "Men": (Men)?1:0,
                "Womman": (womman)?1:0,
                "RangeMax": RangeMax,
                "RangeMin": RangeMin,
                "Lenguage":"ENG",
                "importance_level": level
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
        const run = async () =>
            await UpdateSystems();
        run();
    }, []);

    return (
        <div style={{ height: 625, width: '100%' }}>
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
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                <Typography component="h1" variant="h5">Body Organs</Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <Autocomplete
                            id="free-solo-demo"
                            onChange={(event, newValue) => {
                                setSystems(newValue);
                            }}
                            value={Systems}
                            options={(rowSystems)?rowSystems.map((option) =>option.id + '-' + option.setupsystems):[]}
                            renderInput={(params) => <TextField {...params} label="Systems" />}
                        />
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Importance Level</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={level}
                                onChange={e => setLevel(e.target.value)} 
                            >
                                <FormControlLabel value="High" control={<Radio color="secondary" />} label="High" />
                                <FormControlLabel value="Medium " control={<Radio />} label="Medium " />
                                <FormControlLabel value="Low" control={<Radio color="success" />} label="Low" />
                            </RadioGroup>
                        </FormControl>
                        <TextField value={BodyOrgans} onChange={e => setBodyOrgans(e.target.value)} margin="normal" fullWidth id="BodyOrgans" label="BodyOrgans" name="BodyOrgans"/>
                        <FormControlLabel control={<Checkbox onChange={e => setLeft(e.target.checked) } checked={Left} name='Left' id='Left' />} label="Left" />
                        <FormControlLabel control={<Checkbox onChange={e =>  setRight(e.target.checked)} checked={Right} name='Right' id='Right' />} label="Right" />
                        <FormControlLabel control={<Checkbox onChange={e =>  setMen(e.target.checked)} checked={Men} name='Men' id='Men' />} label="Men" />
                        <FormControlLabel control={<Checkbox onChange={e => setwomman(e.target.checked)} checked={womman} name='Womman' id='Womman' />} label="Womman" />
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

export default SetupOrgans