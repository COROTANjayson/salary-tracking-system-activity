import {useState} from "react";
import {
  Typography,
  Box,
  Container,
  BottomNavigationAction,
  BottomNavigation
  } from '@mui/material';
import _ from 'lodash'
import { EmployerTable } from "../table/EmployerTable";
import { CompanyTable } from "../table/CompanyTable";

export default function Admin() {
  return (
    <Box >
        <AdminDashboard/>
    </Box>
  )
}
const AdminDashboard = () =>{
    const [nav, setNav] = useState(0);

    return (
    <div>
        <Container maxWidth='xl'>
        <Box m={2}  
            sx={{ 
                boxShadow: 2,
                paddingLeft: 5 ,
                paddingRight: 5 ,
                paddingBottom: 2,
                paddingTop: 2 ,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between', 
                borderRadius: 7, 
                backgroundColor: '#0ea5e9'}}>
                
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box>
                <Typography variant="h2" component="div" sx={{ color: '#ffffff'}}>
                    Admin Dashboard
                </Typography>
                
            </Box>
        </Box>
        </Box>
            <Box sx={{mt: 2, pb:2,  borderRadius: 3, boxShadow: 2, }} bgcolor='white'>
                                <BottomNavigation
                                sx={{borderRadius: 3}}
                                showLabels
                                value={nav}
                                onChange={(event, newValue) => {
                                    setNav(newValue);
                                }}
                                >
                                    <BottomNavigationAction sx={{fontWeight: 'bold', }} label="Employers"  />
                                    <BottomNavigationAction sx={{fontWeight: 'bold', }}  label="Company"  />
                                </BottomNavigation>
                                {(nav===0)? <EmployerTable/>:<CompanyTable/>}
                            </Box>
        </Container>
    </div>
    )
}





