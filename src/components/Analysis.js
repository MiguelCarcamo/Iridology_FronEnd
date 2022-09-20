import React, { useState, useEffect } from 'react'
import InformationBox from './InformationBox';
import { Grid, Container, Box, Typography, TextField, Transition, AppBar, Toolbar, IconButton } from '@mui/material';
import { ButtonGroup, Button  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



function Analysis() {
const [New, setNew] = useState(0);
const [proces, setProces] = useState(0);
const [complete, setComplete] = useState(0);
const [rowData, setRowData] = useState([]);
const [rowData2, setRowData2] = useState([]);
const [rowData3, setRowData3] = useState([]);
const [open, setOpen] = useState(false);
const [table, setTable] = useState();
const [columns, setColumns] = useState([
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'Patient', headerName: 'Name Patient', width: 400 },
  { field: 'CreateDate', headerName: 'CreateDate', width: 200 },
  { field: 'FinishDate', headerName: 'FinishDate', width: 200 },
  { field: 'Status', headerName: 'StatusName', width: 100 },
]);
const url1 = 'https://iridologyapirest.herokuapp.com/api/Analysis/';
const url2 = 'https://iridologyapirest.herokuapp.com/api/SetupSystems/';
const url3 = 'https://iridologyapirest.herokuapp.com/api/SetupBodyOrgans/';

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const UpdateAnalysis = async () =>  {
  try {
      const data = await fetch(url1);
      const data1 = await data.json();
      setRowData(data1.filter(i=> i.Status != 'DELETE'));
      setNew(data1.filter(i=> i.Status == 'NEW').length)
      setProces(data1.filter(i=> i.Status == 'IN PROCESS').length)
      setComplete(data1.filter(i=> i.Status == 'Complete').length)
  } catch (error) {
      console.log(error); 
  }
}
const UpdateSystems = async () =>  {
  try {
      const data = await fetch(url2);
      const data1 = await data.json();
      setRowData2(data1);
  } catch (error) {
      console.log(error); 
  }
}
const UpdateOrgans = async () =>  {
  try {
      const data = await fetch(url3);
      const data1 = await data.json();
      setRowData3(data1);
  } catch (error) {
      console.log(error); 
  }
}
useEffect(() => {
  UpdateAnalysis();
  UpdateSystems();
  UpdateOrgans();
}, []);

  return (
    <div style={{ height: 725, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1
          },
        }}
      >
        <InformationBox title="New" num={New} color="#EC7063" />
        <InformationBox title="In Proces" num={proces} color="#F9E79F" />
        <InformationBox title="Complete" num={complete} color="#58D68D" />
      </Box>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={handleOpen} variant="contained" color="primary" startIcon={<RefreshIcon />} > Update</Button>
      </ButtonGroup>
      {rowData?
        <DataGrid 
            style={{ height: 550, width: '100%' }} 
            rows={rowData} 
            columns={columns}
            // onRowClick={(x)=> setrowDataUpdate(x.row.id)}
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Analysis
            </Typography>
            <Button autoFocus color="inherit">
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box component="form" noValidate sx={{ mt: 1 }}>
            {rowData2?
            rowData2.map((option) =>
            <Accordion key={option.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
                <Typography>{option.setupsystems}</Typography>
              </AccordionSummary>
              <AccordionDetails>
              {rowData3?
                rowData3.map((option2) =>
                  (option2.SetupSystems == option.setupsystems) ?
                    <TextField key={option2.id} inputProps={{max: 100, min:1}} type="number" margin="normal" fullWidth label={option2.BodyOrgans} />
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

