import React, {useState, useEffect} from 'react'
import InformationBox from './InformationBox';
import { Grid, Container, Box, Typography, TextField } from '@mui/material';
import { ButtonGroup,Button  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



function preventDefault(event) {
  event.preventDefault();
}
function Analysis() {
    const [rowData, setRowData] = useState([]);
    const [formValue , setFormValue] = useState();
    const url2 = 'http://127.0.0.1:5000/api/v1/systems';
    const url3 = 'http://127.0.0.1:5000/api/v1/bodyorgans';
    const [rowSystems, setRowSystems] = useState();
    const [rowOrgans, setRowOrgans] = useState();
    const [value, setValue] = React.useState(0);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'PatientName', headerName: 'Patient Name', width: 300 },
        { field: 'CreateDate', headerName: 'Application date', width: 150 },
        { field: 'Doctor', headerName: 'Doctor', width: 100 },
        { field: 'Status', headerName: 'Status', width: 100 }
      ]);
    const [open, setOpen] = useState(false);
    const [lista, setLista] = useState();
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const UpdateSystems = async () =>  {
        try {
            const data = await fetch(url2);
            const data1 = await data.json();
            setRowSystems(JSON.parse(data1));
        } catch (error) {
           console.log(error); 
        }
    }
    const UpdateOrgans = async () =>  {
        try {
            const data = await fetch(url3);
            const data1 = await data.json();
            setRowOrgans(JSON.parse(data1));
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
    useEffect(() => {
        UpdateOrgans();
    }, []);

    useEffect(() => {
        UpdateSystems();
    }, []);
    useEffect(() => {
        if(rowSystems){
            const x = 
                <div>
                    {rowSystems.map((x) =>
                    <Accordion key={x['id']}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography>{x['SetupSystems']}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        {
                            rowOrgans.map((y) => (x['SetupSystems']==y['SetupSystems']) ?
                            <TextField onChange={handleChange} key={y['id']} type="number" margin="normal" fullWidth id={y['BodyOrgans']} label={y['BodyOrgans']} name={y['BodyOrgans']}/>
                            :false
                            )
                        }
                        </AccordionDetails>
                    </Accordion>
                    )}
                </div>
            setLista(x);
        }
    }, [rowSystems]);

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <InformationBox color='#84b6f4' title='New' num='30' />
                    <InformationBox color='#fdfd96' title='In Process' num='25' />
                    <InformationBox color='#77dd77' title='Complete' num='50' />
                    <InformationBox color='#fdcae1' title='All Analyzes' num='105' />
                </Grid>
            </Container>
            <div style={{ height: 625, width: '100%' }}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button onClick={handleOpen} startIcon={<RefreshIcon />} > Update</Button>
                </ButtonGroup>
                <DataGrid style={{ height: 550, width: '100%' }} rows={rowData} columns={columns} />
                <Dialog open={open} >
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
                        <Typography component="h1" variant="h5">Analysis</Typography>
                            <Box component="form" noValidate sx={{ mt: 1 }}>
                            <ButtonGroup aria-label="outlined primary button group">
                                <Button variant="contained" sx={{ mt: 3, mb: 2 }} startIcon={<RefreshIcon />} >Update</Button>  
                                <Button variant="contained" color="error" sx={{ mt: 3, mb: 2 }} onClick={handleClose} startIcon={<CloseIcon />} > Close</Button>
                            </ButtonGroup>
                            {lista}
                            </Box>
                        </Box>
                    </Grid>
                </Dialog>
            </div>
        </>
        )
}
export default Analysis