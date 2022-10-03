import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useParams  } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AppBarNav from "../components/AppBar";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

// componentes del body menu
import SetupSystemps from "../components/SetupSystemps";
import SetupOrgans from "../components/SetupOrgans";
import SetupFindings from "../components/SetupFindings";
import SetupSymptoms from "../components/SetupSymptoms";
import AnalysisPatient from "../components/AnalysisPatient";
import Analysis from "../components/Analysis";
import AnalysisCustomer from "../components/AnalysisCustomer";
import { IconButton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

const mdTheme = createTheme();

export default function Main() {
  const { ruta } = useParams();

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarNav />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Breadcrumbs aria-label="breadcrumb">
                  
                  <Typography color="text.primary">
                    <NavLink to={'/Main/'}>
                      Main
                    </NavLink>
                  </Typography>
                  <Typography color="text.primary">{ruta}</Typography>
                  <IconButton onClick={() => {window.location.reload(false)}} color="primary" component="label">
                    <CachedIcon />
                  </IconButton>
                </Breadcrumbs>
                </Paper>
                {(ruta) ?
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  {
                    {
                      'SetupSystems': <SetupSystemps />,
                      'SetupOrgans': <SetupOrgans />,
                      'SetupFindings': <SetupFindings />,
                      'SetupSymptoms': <SetupSymptoms />,
                      'AnalysisPatient': <AnalysisPatient />,
                      'Analysis': <Analysis />,
                      'MyAnalyzes': <AnalysisCustomer />,
                    }[ruta]
                  }
                  
                </Paper>
                : null
                }
                
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}