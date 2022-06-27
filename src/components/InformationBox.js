import React, { useEffect, useState } from 'react'
import { Grid, Paper} from '@mui/material';
import Typography from '@mui/material/Typography';

function preventDefault(event) {
    event.preventDefault();
  }

function InformationBox(props) {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  return (
    <Grid item xs={12} md={4} lg={3}>
        <Paper
        sx={{
            p: 2,
            display: 'flex',
            backgroundColor: props.color,
            flexDirection: 'column',
            height: 160,
        }}
        >
            <Typography component="h2" variant="h6" gutterBottom>
                {props.title}
            </Typography>
            <Typography component="p" variant="h4">
                {props.num}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {date}
            </Typography>
        </Paper>
    </Grid>
  )
}

export default InformationBox