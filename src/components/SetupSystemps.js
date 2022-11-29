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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function SetupSystemps() {
    const url = 'https://208.109.191.54/api/SetupSystems/';
    const [open, setOpen] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [rowDataEdi, setRowDataEdi] = useState([]);
    const [Action, setAction] = useState(0);
    const [formValue , setFormValue] = useState({
        Systems : "",
        RangeMax : 0,
        RangeMin : 0
    })
    const [level, setLevel] = useState("High");
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
                                setLevel("High");
                            }
    const handleOpenU = () => {
                                if (!rowDataEdi.id){
                                    swal("¡Debe seleccionar un campo!")
                                }else{
                                    setOpen(true);
                                    setAction(rowDataEdi.id);
                                    setFormValue({Systems:rowDataEdi.setupsystems, RangeMax:rowDataEdi.rangemax, RangeMin:rowDataEdi.rangemin });
                                    setLevel(rowDataEdi.importance_level);
                                }
                            }
    const handleClose = () => setOpen(false);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'setupsystems', headerName: 'Setup Systems', width: 350 },
        { field: 'importance_level', headerName: 'Importance Level', width: 150 },
        { field: 'rangemax', headerName: 'Range Max', width: 125 },
        { field: 'rangemin', headerName: 'Range Min', width: 125 },
        { field: 'lenguage', headerName: 'Lenguage', width: 150 },
      ]);
    
    const UpdateData = async () =>  {
        try {
            const data = await fetch(url);
            const data1 = await data.json();
            setRowData(data1);
        } catch (error) {
           console.log(error); 
        }
    }
    const Create = async ()=> {
        await fetch('https://208.109.191.54/api/SetupSystems/add', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "SetupSystems": formValue.Systems,
                "RangeMax": formValue.RangeMax,
                "RangeMin": formValue.RangeMin,
                "Lenguage": "ENG",
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
    const update = async ()=> {
        await fetch('https://208.109.191.54/api/SetupSystems/update', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify([{
                "IDSetupSystems" : Action,
                "SetupSystems": formValue.Systems,
                "RangeMax": formValue.RangeMax,
                "RangeMin": formValue.RangeMin,
                "Lenguage": "ENG",
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
    useEffect(() => {
        const run = async () =>
            await UpdateData();
        run();
    }, []);
    
    return (
        <div style={{ height: 625, width: '100%' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={handleOpenN} variant="contained" color="success" startIcon={<AddIcon />}  > New</Button>
                <Button onClick={handleOpenU} startIcon={<RefreshIcon />} > Update</Button>
            </ButtonGroup>
            {rowData ?
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