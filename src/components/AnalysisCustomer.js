import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { Grid, Paper, Box, Typography, Dialog, FormControl, InputLabel, Select, MenuItem,  } from '@mui/material';
import { FilledInput } from '@mui/material';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
// https://iridologyapirest.herokuapp.com/api/Analysis/
const cookies = new Cookies();

function AnalysisCustomer() {
  const [rowData, setRowData] = useState([]);
  const [rowDataUpdate, setrowDataUpdate] = useState(false);
  const [rowData2, setRowData2] = useState([]);
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState();
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [Patient , setPatient] = useState(0)
  const url3 = 'https://iridologyapirest.herokuapp.com/api/AnalysisPatient/';
  const url2 = 'https://iridologyapirest.herokuapp.com/api/Analysis/';
  const url4 = 'https://iridologyapirest.herokuapp.com/api/Analysis/update';
  const [columns, setColumns] = useState([
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'Patient', headerName: 'Name Patient', width: 400 },
    { field: 'CreateDate', headerName: 'CreateDate', width: 200 },
    { field: 'FinishDate', headerName: 'FinishDate', width: 200 },
    { field: 'Status', headerName: 'StatusName', width: 100 },
  ]);
  
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const UpdateAnalysisPatients = async () =>  {
    try {
        const data = await fetch(url3);
        const data1 = await data.json();
        setRowData2(data1);
    } catch (error) {
        console.log(error); 
    }
  }
  const UpdateAnalysis = async () =>  {
    try {
        const data = await fetch(url2);
        const data1 = await data.json();
        setRowData(data1.filter(i=> i.IDUser == cookies.get('IDUser')));
    } catch (error) {
        console.log(error); 
    }
  }
  const EnviarDatos = async () => {
    var url = 'https://iridologyapirest.herokuapp.com/api/Analysis/add'
    const data = await fetch(url, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
              "IDPatient": Patient,
              "IDDoctor": '1',
              "Status": '1',
              "URLLeft": file.name,
              "URLRight": file2.name
          }])
      }
    );
    const data1 = await data.json();
    if (data1['msj'] == 'Accion Realizada Correctamente'){
        const form = new FormData();
        form.append('File', file);
        const x = await fetch('https://iridologyapirest.herokuapp.com/api/File/add' , {
            method: 'POST',
            body: form,
            }
        );
        const form2 = new FormData();
        form2.append('File', file2);
        const x2 = await fetch('https://iridologyapirest.herokuapp.com/api/File/add' , {
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
  const EnviarDatos2 = async () => {
    var url = 'https://iridologyapirest.herokuapp.com/api/Analysis/update'
    const data = await fetch(url, {
      method: 'put',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
              "IDAnalysis": rowDataUpdate,
              "Status": '4'
          }])
      }
    );
  }
  const handleOpenUpdate = () => { 
    if (rowDataUpdate == false){
      swal("Select", "You must select an item :)", "warning");
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
            UpdateAnalysis();
          });
        } else {
          swal("Cancelled", "Your file is safe :)", "error");
        }
      })
    }
  }

  useEffect(() => {
    UpdateAnalysisPatients();
  }, []);
  useEffect(() => {
    UpdateAnalysis();
  }, []);
  return (
    <div style={{ height: 625, width: '100%' }}>
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={handleOpen} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
      <Button onClick={handleOpenUpdate} variant="contained" color="primary" startIcon={<AutoDeleteIcon />} > Cancel </Button>
    </ButtonGroup>
    {rowData?
        <DataGrid 
            style={{ height: 550, width: '100%' }} 
            rows={rowData} 
            columns={columns}
            onRowClick={(x)=> setrowDataUpdate(x.row.id)}
        />
    : false}
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