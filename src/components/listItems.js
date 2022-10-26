import React, {useState} from 'react';
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
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';


export default function ListItem() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const [open2, setOpen2] = useState(true);
  const handleClick2 = () => {
    setOpen2(!open2);
  };  
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
        <List onClick={() => navigate('/Main/SetupSystems')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <BoyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Body Systems" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/SetupOrgans')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FavoriteOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Body Organs" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/SetupFindings')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <HealthAndSafetyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Findings" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/SetupSymptoms')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <AddAlertOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Symptoms" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/SetupFoods')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <RestaurantIcon />
            </ListItemIcon>
            <ListItemText primary="Foods" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/SetupRanges')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <LowPriorityOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Ranges" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
          <AnalyticsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Analysis" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List onClick={() => navigate('/Main/AnalysisPatient')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <AdminPanelSettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Patients" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/Analysis')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <InsightsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Analysis" />
          </ListItemButton>
        </List>
        <List onClick={() => navigate('/Main/MyAnalyzes')} component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <InsightsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="My Analyzes" />
          </ListItemButton>
        </List>
      </Collapse>
  </React.Fragment>
  );
}