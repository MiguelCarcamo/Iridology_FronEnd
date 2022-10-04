import React, { useState, useEffect } from 'react'
import {ClockLoader, RingLoader , BounceLoader } from "react-spinners";
import InformationBox from './InformationBox';
import { Grid, Container, Box, Typography, TextField, AppBar, Toolbar, IconButton, Alert } from '@mui/material';
import { ButtonGroup, Button  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();


function Analysis() {
const navigate = useNavigate();
let [loading, setLoading] = useState(false);
let [AssiBtn, setAssiBtn] = useState(true);
let [UpdBtn, setUpdBtn] = useState(true);
const [New, setNew] = useState(0);
const [DataValue, setDataValue] = useState([]);
const [CantOrg, setCantOrg] = useState(0);
const [CantOrgPro, setCantOrgPro] = useState(0);
const [Analysis, setAnalysis] = useState(false);
const [proces, setProces] = useState(0);
const [complete, setComplete] = useState(0);
const [all, setAll] = useState(0);
const [rowData, setRowData] = useState([]);
const [rowData2, setRowData2] = useState([]);
const [rowData3, setRowData3] = useState([]);
const [open, setOpen] = useState(false);
const [table, setTable] = useState();
const [columns, setColumns] = useState([
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'Patient', headerName: 'Name Patient', width: 400 },
  { field: 'Status', headerName: 'StatusName', width: 100 },
  { field: 'Gender', headerName: 'Gender', width: 100 },
  { field: 'CreateDate', headerName: 'CreateDate', width: 200 },
]);
const url1 = 'https://iridologyapirest.herokuapp.com/api/Analysis/';
const url2 = 'https://iridologyapirest.herokuapp.com/api/AnalysisSistems/';
const url3 = 'https://iridologyapirest.herokuapp.com/api/AnalysisBodyOrgans/';

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const UpdateAnalysis = async () =>  {
  try {
      const data = await fetch(url1);
      const data1 = await data.json();
      setRowData(data1.filter(i=> i.Status != 'DELETE'));
      setNew(data1.filter(i=> i.Status == 'NEW').length)
      setProces(data1.filter(i=> i.Status == 'IN PROCESS').length)
      setComplete(data1.filter(i=> i.Status == 'COMPLETE').length)
      setAll(data1.length)
  } catch (error) {
      console.log(error); 
  }
}
const UpdateSystems = async () =>  {
  try {
      if (Analysis != false){
        const data = await fetch(url2 + Analysis.id);
        const data1 = await data.json();
        setRowData2(data1);
      }
  } catch (error) {
      console.log(error); 
  }
}
const UpdateOrgans = async () =>  {
  try {
      if (Analysis != false){
        const data = await fetch(url3 + Analysis.id);
        const data1 = await data.json();
        setRowData3(data1);
        setCantOrg(data1.length);
        setCantOrgPro(0);
        setDataValue([]);
      }
  } catch (error) {
      console.log(error); 
  }
}
const EnviarDatos2 = async () => {
  var url = 'https://iridologyapirest.herokuapp.com/api/Analysis/update2'
  const data = await fetch(url, {
    method: 'put',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify([{
            "IDAnalysis": Analysis.id,
            "IDDoctor": cookies.get('IDUser'),
            "Gender": Analysis.Gender
        }])
    }
  );
}
const UpdateAssigned = async () => {
  if (Analysis == false){
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
const PrepareData = async (id, sistems, name, value) => {
  if(value > 0){
    if(DataValue.filter((item) => item[0] == id).length == 1){
      setDataValue(DataValue.filter((item) => item[0] !== id))
      setDataValue(oldArray => [...oldArray, [id, sistems, name, value]]);
    }else{
      setDataValue(oldArray => [...oldArray, [id, sistems, name, value]]);
      setCantOrgPro(CantOrgPro + 1);
    }
  }
  if(value == 0){
    setDataValue(DataValue.filter((item) => item[0] !== id))
    if(DataValue.filter((item) => item[0] == id).length >= 1){
      setCantOrgPro(CantOrgPro - 1);
    }
  }
}
const SaveData = async() => {
  setLoading(true);
  if(CantOrgPro < CantOrg){
    swal("Incomplete Analysis", "You must complete the form!", "warning");
  }else{
    var url = 'https://iridologyapirest.herokuapp.com/api/AnalysisBodyOrgans/update'
    for (let i = 0; i < DataValue.length; i++) {
      const data = await fetch(url, {
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify([{
                "id": DataValue[i][0],
                "bodyorgansvalue": DataValue[i][3],
                "systems": DataValue[i][1],
                "bodyorgans": DataValue[i][2]
            }])
        }
      );
    }
    var url = 'https://iridologyapirest.herokuapp.com/api/AnalysisSistems/update'
    const data3 = await fetch(url, {
      method: 'put',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
              "id": Analysis.id
          }])
      }
    );
    var url = 'https://iridologyapirest.herokuapp.com/api/Analysis/update'
    const data2 = await fetch(url, {
      method: 'put',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify([{
              "IDAnalysis": Analysis.id,
              "Status": '3'
          }])
      }
    );
  }
  setLoading(false);
  handleClose();
  swal("Complete", "Your file is safe :)", "success");
  UpdateAnalysis();
}
useEffect(() => {
  UpdateAnalysis();
}, []);
useEffect(() => {
  UpdateSystems();
  UpdateOrgans();
  if(Analysis.Status == 'IN PROCESS'){
    setUpdBtn(false);
    setAssiBtn(true);
  }
  if(Analysis.Status == 'NEW'){
    setAssiBtn(false);
    setUpdBtn(true);
  }
  if(Analysis.Status == 'COMPLETE' || Analysis.Status == 'DELETE'){
    setUpdBtn(true);
    setAssiBtn(true);
  }
}, [Analysis]);

  return (
    <div style={{ height: 900, width: '100%' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
              <InformationBox color='#84b6f4' title='New' num={New} />
              <InformationBox color='#fdfd96' title='In Process' num={proces} />
              <InformationBox color='#77dd77' title='Complete' num={complete} />
              <InformationBox color='#fdcae1' title='All Analyzes' num={all} />
          </Grid>
      </Container>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button disabled={AssiBtn} onClick={UpdateAssigned} variant="contained" color="success" startIcon={<AssignmentIcon />} > Assiganed</Button>
        <Button disabled={UpdBtn} onClick={handleOpen} variant="contained" color="primary" startIcon={<RefreshIcon />} > Update</Button>
      </ButtonGroup>
      {rowData?
        <DataGrid 
            style={{ height: 450, width: '100%' }} 
            rows={rowData} 
            columns={columns}
            onRowClick={(x)=> setAnalysis(x.row)}
        />
    : false}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <ClockLoader color="#ffffff" loading={loading} size={50} />
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Analysis
            </Typography>
            <Alert severity={CantOrgPro < CantOrg?"error":"success"}>{CantOrgPro}/{CantOrg}</Alert>
            <Button variant="contained" color="success" onClick={SaveData} endIcon={<SendIcon />}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box component="form" noValidate sx={{ mt: 1 }}>
            {rowData2?
            rowData2.map((option) =>
            <Accordion key={option.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                <Typography>{option.Sistems}</Typography>
              </AccordionSummary>
              <AccordionDetails>
              {rowData3?
                rowData3.map((option2) =>
                  (option2.Sistems == option.Sistems) ?
                    <TextField name={option2.bodyorgans} onBlur={e => PrepareData(option2.id, option2.Sistems, option2.bodyorgans, e.target.value)} key={option2.id} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth label={option2.bodyorgans} />
                  :false
                ):false}
              </AccordionDetails>
            </Accordion>
            )
            :false}
          </Box>
      </Dialog>
    </div>
  )
}

export default Analysis

