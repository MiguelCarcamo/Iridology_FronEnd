import React, {useState, useEffect} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BoyOutlinedIcon from '@mui/icons-material/BoyOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import AddAlertOutlinedIcon from '@mui/icons-material/AddAlertOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function ListItem() {
  const [rowData, setRowData] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const [open2, setOpen2] = useState(true);
  const handleClick2 = () => {
    setOpen2(!open2);
  };
  const UpdateData = async () =>  {
    try {
        const data = await fetch("https://208.109.191.54/api/user/Display/" + cookies.get('IDUser'));
        const data1 = await data.json();
        setRowData(data1);
    } catch (error) {
        console.log(error); 
    }
}
// EN ESTA SECCION CONTIENE TODAS LAS USEEFFECT QUE REQUERIMOS PARA EL FUNCIONAMIENTO
useEffect(() => {
  const run = async () =>
      await UpdateData();
  run();
}, []);
  
return(
  <React.Fragment>
    <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Setup" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
      {rowData?
      rowData.reverse().map((i) => i.Seccion == 1?
      <List key={i.id} onClick={() => navigate(i.navigate.toString())} component="div" disablePadding hidden={!i.access} >
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            {{
              'Setup User': <SupervisedUserCircleIcon />,
              'Body Systems': <BoyOutlinedIcon />,
              'Body Organs': <FavoriteOutlinedIcon />,
              'Findings': <HealthAndSafetyOutlinedIcon />,
              'Symptoms': <AddAlertOutlinedIcon />,
              'Foods': <RestaurantIcon />,
              'Ranges': <LowPriorityOutlinedIcon />,
            }[i.namedisplay.toString()]
            } 
          </ListItemIcon>
          <ListItemText primary={i.namedisplay.toString()} />
        </ListItemButton>
      </List>
      :false)
      :false}
      </Collapse>
      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
          <AnalyticsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Analysis" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        {rowData?
        rowData.reverse().map((i) => i.Seccion == 2?
        <List key={i.id} onClick={() => navigate(i.navigate.toString())} component="div" disablePadding hidden={!i.access}>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              {{
                'Patients': <AdminPanelSettingsOutlinedIcon />,
                'Analysis': <InsightsOutlinedIcon />,
                'My Analyzes': <InsightsOutlinedIcon />,
              }[i.namedisplay.toString()]
              } 
            </ListItemIcon>
            <ListItemText primary={i.namedisplay.toString()} />
          </ListItemButton>
        </List>
        :false)
        :false}
      </Collapse>
  </React.Fragment>
  );
}