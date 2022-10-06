import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { Grid, Paper, Box, Typography, Dialog, FormControl, InputLabel, Select, MenuItem, DialogTitle, Chip, TextField  } from '@mui/material';
import { FilledInput } from '@mui/material';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// https://iridologyapirest.herokuapp.com/api/Analysis/
const cookies = new Cookies();

function AnalysisCustomer() {
  const [rowData, setRowData] = useState([]);
  const [rowDataUpdate, setrowDataUpdate] = useState(false);
  const [rowData2, setRowData2] = useState([]);
  const [rowData3, setRowData3] = useState([]);
  const [rowData4, setRowData4] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [Patient , setPatient] = useState(0);
  let [CancelBtn, setCancelBtn] = useState(true);
  let [ReportBtn, setReportBtn] = useState(true);
  const url3 = 'https://iridologyapirest.herokuapp.com/api/AnalysisPatient/';
  const url2 = 'https://iridologyapirest.herokuapp.com/api/Analysis/';
  const url4 = 'https://iridologyapirest.herokuapp.com/api/Analysis/update';
  const url5 = 'https://iridologyapirest.herokuapp.com/api/AnalysisSistems/';
  const url6 = 'https://iridologyapirest.herokuapp.com/api/AnalysisBodyOrgans/';
  const [columns, setColumns] = useState([
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'Patient', headerName: 'Name Patient', width: 400 },
    { field: 'CreateDate', headerName: 'CreateDate', width: 200 },
    { field: 'Status', headerName: 'StatusName', width: 100 },
  ]);
  
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleClose3 = () => setOpen3(false);
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
              "IDAnalysis": rowDataUpdate.id,
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
          swal("Complete", "Your file is safe :)", "success");
        }
      })
    }
  }
  const UpdateSystems = async () =>  {
    try {
        if (rowDataUpdate != false){
          const data = await fetch(url5 + rowDataUpdate.id);
          const data1 = await data.json();
          setRowData3(data1);
        }
    } catch (error) {
        console.log(error); 
    }
  }
  const UpdateBodyOrgans = async () =>  {
    try {
        if (rowDataUpdate != false){
          const data = await fetch(url6 + rowDataUpdate.id);
          const data1 = await data.json();
          setRowData4(data1);
        }
    } catch (error) {
        console.log(error); 
    }
  }

  useEffect(() => {
    UpdateAnalysisPatients();
  }, []);
  useEffect(() => {
    UpdateAnalysis();
  }, []);
  useEffect(() => {
    UpdateSystems();
    UpdateBodyOrgans();
    if(rowDataUpdate.Status == 'NEW'){
      setCancelBtn(false);
      setReportBtn(true);
    }
    if(rowDataUpdate.Status == 'COMPLETE'){
      setReportBtn(false);
      setCancelBtn(true);
    }
    if(rowDataUpdate.Status == 'IN PROCESS' || rowDataUpdate.Status == 'DELETE'){
      setCancelBtn(true);
      setReportBtn(true);
    }
  }, [rowDataUpdate]);

  return (
    <div style={{ height: 625, width: '100%' }}>
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={handleOpen} variant="contained" color="success" startIcon={<AddIcon />} > New</Button>
      <Button disabled={CancelBtn} onClick={handleOpenUpdate} variant="contained" color="primary" startIcon={<AutoDeleteIcon />} > Cancel </Button>
      <Button disabled={ReportBtn} onClick={()=>setOpen2(true)} variant="contained" color="secondary" startIcon={<AssessmentIcon />} > Report </Button>
      <Button disabled={ReportBtn} onClick={()=>setOpen3(true)} variant="outlined" color="secondary" startIcon={<AssessmentIcon />} > quick report </Button>
    </ButtonGroup>
    {rowData?
        <DataGrid 
            style={{ height: 550, width: '100%' }} 
            rows={rowData} 
            columns={columns}
            onRowClick={(x)=> setrowDataUpdate(x.row)}
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
    <Dialog open={open2} onClose={handleClose2} fullWidth maxWidth="md">
        <DialogTitle id="max-width-dialog-title">Report</DialogTitle>
          {rowData3?
            rowData3.map((option) =>
            <Accordion key={option.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                <Typography variant="h5">{option.Sistems}    .</Typography>
                <Typography variant="h6" >-  [ {option.Value} ]</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>BodyOrgans</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">Symptoms</TableCell>
                        <TableCell align="center">Findings</TableCell>
                        <TableCell align="center">Foods</TableCell>
                        <TableCell align="center">Not Foods</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {rowData4?
                    rowData4.map((row) => (
                      (row.Sistems == option.Sistems) ?
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">{row.bodyorgans}</TableCell>
                        <TableCell align="left">{row.bodyorgansvalue}</TableCell>
                        <TableCell align="left">{String(row.symptoms).replace(/[{}"]/g, '')}</TableCell>
                        <TableCell align="left">{String(row.findings).replace(/[{}"]/g, '')}</TableCell>
                        <TableCell align="left">{String(row.foods).replace(/[{}"]/g, '')}</TableCell>
                        <TableCell align="left">{String(row.notfoods).replace(/[{}"]/g, '')}</TableCell>
                      </TableRow>
                      :false
                    )):false}
                  </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            )
            :false}
    </Dialog>
    <Dialog open={open3} onClose={handleClose3} fullWidth maxWidth="lg">
      <DialogTitle id="max-width-dialog-title">Report</DialogTitle>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sistems</TableCell>
              <TableCell>BodyOrgans</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Symptoms</TableCell>
              <TableCell align="center">Findings</TableCell>
              <TableCell align="center">Foods</TableCell>
              <TableCell align="center">Not Foods</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rowData4?
          rowData4.map((row) => (
            (row.bodyorgansvalue < 50) ?
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.Sistems}</TableCell>
              <TableCell align="left">{row.bodyorgans}</TableCell>
              <TableCell align="left">{row.bodyorgansvalue}</TableCell>
              <TableCell align="left">{String(row.symptoms).replace(/[{}"]/g, '')}</TableCell>
              <TableCell align="left">{String(row.findings).replace(/[{}"]/g, '')}</TableCell>
              <TableCell align="left">{String(row.foods).replace(/[{}"]/g, '')}</TableCell>
              <TableCell align="left">{String(row.notfoods).replace(/[{}"]/g, '')}</TableCell>
            </TableRow>
            :false
          )):false}
        </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  </div>
  )
}

export default AnalysisCustomer