import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Paper, Box, Typography, Dialog, TextField, FormControl, InputLabel, Select, MenuItem,  } from '@mui/material';
import { FilledInput } from '@mui/material';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';

const cookies = new Cookies();

function AnalysisCustomer() {
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState();
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [Patient , setPatient] = useState(0)
  const url2 = 'http://127.0.0.1:5000/api/v1/analysis/0';
  const url3 = 'http://127.0.0.1:5000/api/v1/analysispatient';
  const [columns, setColumns] = useState([
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'NamePatient', headerName: 'Name Patient', width: 500 },
    { field: 'CreateDate', headerName: 'CreateDate', width: 150 },
    { field: 'FinishDate', headerName: 'FinishDate', width: 150 },
    { field: 'StatusName', headerName: 'StatusName', width: 100 },
  ]);
  
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const UpdateAnalysisPatients = async () =>  {
    try {
        const data = await fetch(url3);
        const data1 = await data.json();
        setRowData2(JSON.parse(data1));
    } catch (error) {
        console.log(error); 
    }
  }
  const UpdateAnalysis = async () =>  {
    try {
        const data = await fetch(url2);
        const data1 = await data.json();
        setRowData(JSON.parse(data1).filter(i=> i.IDUser == cookies.get('IDUser')));
    } catch (error) {
        console.log(error); 
    }
  }
  const EnviarDatos = async () => {
    var url = 'http://127.0.0.1:5000/api/v1/analysis/0'
    const data = await fetch(url, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
              "IDPatient": Patient,
              "IDDoctor": '1',
              "URLLeft": file.name,
              "URLRight": file2.name
          }])
      }
    );
    const data1 = await data.json();
    if (data1['msj'] == 'Accion Realizada Correctamente'){
        const form = new FormData();
        form.append('File', file);
        const x = await fetch('http://127.0.0.1:5000/api/v1/Files/0' , {
            method: 'POST',
            body: form,
            }
        );
        const form2 = new FormData();
        form2.append('File', file2);
        const x2 = await fetch('http://127.0.0.1:5000/api/v1/Files/0' , {
            method: 'POST',
            body: form2,
            }
        );
        swal(data1['msj']);
        handleClose();
        UpdateAnalysis();
    }else{
      swal(data1['msj']);
    }
  }

  useEffect(() => {
    UpdateAnalysisPatients();
  }, []);
  useEffect(() => {
    UpdateAnalysis();
  }, []);
  useEffect(() => {
    if(rowData){
        const x = <DataGrid style={{ height: 550, width: '100%' }} rows={rowData} columns={columns} />
        setTable(x);
    }
    }, [rowData]);
  return (
    <div style={{ height: 625, width: '100%' }}>
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={handleOpen} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
    </ButtonGroup>
    {table}
    <Dialog open={open} onClose={handleClose} >
      <Grid component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
          <Typography component="h1" variant="h5">New Analysis</Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Patient</InputLabel>
                <Select labelId="demo-simple-select-label" value={Patient} onChange={e => setPatient(e.target.value)} id="demo-simple-select" label="Patient">
                  <MenuItem value={0}><em>None</em></MenuItem>
                    {(rowData2) ? rowData2.map((x) => (x['IDUser'] == cookies.get('IDUser')) ? <MenuItem value={x['id']} key={x['id']} >{x['PatientName'] + ' ' +x['PatientLastName']}</MenuItem>:false) : false}
                </Select>
            </FormControl>
            <InputLabel id="x1">Left</InputLabel>
            <FilledInput fullWidth onChange={(e) => setFile(e.target.files[0])} type='file'></FilledInput>
            <InputLabel id="x1">Rigth</InputLabel>
            <FilledInput fullWidth onChange={(e) => setFile2(e.target.files[0])} type='file'></FilledInput>
            <Button onClick={EnviarDatos} fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }} startIcon={<AddIcon />} >Create</Button>  
          </Box>
          </Box>
      </Grid>
    </Dialog>
  </div>
  )
}

export default AnalysisCustomer