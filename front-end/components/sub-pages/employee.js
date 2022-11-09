import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Divider,
  Typography,
  Box,
  Container,
  BottomNavigationAction,
  BottomNavigation
  } from '@mui/material';

import { getCompanies } from "../../store/reducers/company";

import { DisplayLeaveListTable, DisplayRequestLeaveListTable} from "../table/LeaveListTable";
import { DisplayAbsenceListTable } from "../table/AbsenceListTable";
import { 
    DisplayRequestOverTimeListTable,
    DisplayOverTimeListTable,} from "../table/OverTimeListTable";
import { verifyToken } from "../../pages/api/jwt";
import { 
  getEmployee, 
  getLeavesRemaining,
  getTotalAbsences,
  getTotalOvertime,
  getDailyWage,
  getMonthlySalary

 } from "../../pages/api/employee";
import { getProfile } from "../../pages/api/profile";
import { set } from "lodash";
export default function Employee() {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <EmployeeDashboard/>
    </Box>
  )
}

const EmployeeDashboard = (props) =>{
  
    const [employee, setEmployee] = useState({})
    const [requestNav, setRequestNav] = useState(0);
    useEffect(() => {
      const data = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined
      const fetchEmployer = async () => {
          const payload = await verifyToken(data)
          // return false if not token is invalid
          if(payload !== false){
              const accountData = payload.data
                  try {
                      // console.log(accountData.id)
                      const response = await getEmployee(accountData.id)
                      setEmployee(await response.data)
                  } catch(err) {
                      if(err.response) {
                          console.log(err.response)
                      } else {
                          console.log('Error: ', err.message)
                      }
                  }
              
          }
      }
      fetchEmployer()
      
  }, [])

    let table = <DisplayLeaveListTable leaveList={employee.leaves} employeeId= {employee.id} />
    switch (requestNav) {
    case 0:
        table = <DisplayLeaveListTable leaveList={employee.leaves} employeeId= {employee.id} />
        break;
    case 1:
        table = <DisplayAbsenceListTable absenceList={employee.absence} employeeId= {employee.id}/>
        break;
    case 2:
        table = <DisplayOverTimeListTable overtimeList={employee.overtime} employeeId= {employee.id}/>
        break;
    case 3:
        table = <DisplayRequestLeaveListTable leaveList={employee.requestLeave} employeeId= {employee.id}/>
        break;
    case 4: 
        table = <DisplayRequestOverTimeListTable overtimeList={employee.requestOvertime} employeeId= {employee.id}/>
        break;
    default:
        table = <DisplayLeaveListTable leaveList={employee.leaves} employeeId= {employee.id} />
    }
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
                        <Typography variant="h3" component="div" sx={{ color: '#ffffff'}}>
                            {employee.firstName + ' '+ employee.lastName}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#ffffff'}}>
                            Employee
                        </Typography>
                    </Box>
                    <Typography variant="h5" component="div" sx={{ color: '#ffffff'}}>
                        {employee.name}
                    </Typography>
                </Box>
            </Box>
            <Container maxWidth='xl'>
                <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                    <Box>
                    <Box sx={{
                        mt: 1,
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'white',
                        borderRadius: 4,
                        boxShadow: 2 }}>
                        
                        <SalaryDetails employeeID={employee.id}  employee={employee}/>
                    </Box>
                    </Box>
                </Grid>
                    <Grid item xs={6} md={8}>
                        <Box>
                            <Box sx={{mt: 2, pb:2,  borderRadius: 3, boxShadow: 1}} bgcolor='white'>
                                <BottomNavigation
                                sx={{borderRadius: 3}}
                                showLabels
                                value={requestNav}
                                onChange={(event, newValue) => {
                                    setRequestNav(newValue);
                                }}
                                >
                                <BottomNavigationAction label="Leaves"  />
                                <BottomNavigationAction label="Absences"  />
                                <BottomNavigationAction label="Overtime"  />
                                <BottomNavigationAction label="Request Leave"  />
                                <BottomNavigationAction label="Request Overtime"  />
                                </BottomNavigation>
                                {table}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Container>
    </div>
    )
}

const SalaryDetails = (props) => {
    const {employeeID,  employee} = props

    const [leavesRemaining, setLeavesRemainig] = useState(0)
    const [ttlAbsences, setTotalAbsences] = useState(0)
    const [ttlOvertime, setTotalOvertime] = useState(0)
    const [dailyWage, setDailyWage] = useState(0)
    const [totalMonthlySalary, setTotalMonthlySalary] = useState(0)

    

    useEffect(()=>{
      const fetchComputation = async() =>{
        if(employee){
          const leavesRemaining = await getLeavesRemaining(employeeID)
          setLeavesRemainig(await leavesRemaining.data.result)
          const ttlAbsences = await getTotalAbsences(employeeID)
          setTotalAbsences(await ttlAbsences.data.result)
          const ttlOvertime = await getTotalOvertime(employeeID)
          setTotalOvertime(await ttlOvertime.data.result)
          const dailyWage = await getDailyWage(employeeID)
          setDailyWage(await dailyWage.data.result)
          const totalMonthlySalary = await getMonthlySalary(employeeID)
          setTotalMonthlySalary(await totalMonthlySalary.data.result)
  
        }
        
      }
      if(employeeID){
        fetchComputation()
      }
        
    },[employeeID])
    const style = {background: 'white', borderRadius: 3, boxShadow: 1, padding: 1.5}
    return(
      <Container  sx={{marginTop: 2, }}>
          <Grid container spacing={2} >
              <Grid item xs={6} >
                <Box sx={style}>
                  Company Leaves: {employee.allowableLeaves}
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={style}>
                  Company Overtime Limit: {employee.allowableOvertime}
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={style}>
                  Leaves Remaining: {leavesRemaining}
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={style}>
                  Total Leaves: {employee.allowableLeaves-leavesRemaining}
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={style}>
                  Absences: {ttlAbsences}
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={style}>
                  Overtime: {ttlOvertime}
                </Box>
              </Grid>
              <Grid item xs={6} >
              </Grid>
              <Grid item xs={6} >
              </Grid>
            </Grid>
            <Container sx={style}>
            <Box >
                Salary/hr: {employee.salaryPerHR}
              </Box>
              <Box >
                Daily Wage: {dailyWage}
              </Box>
                  <Box >
                  Current Month total Salary: {totalMonthlySalary}
                  </Box>
            </Container>
      </Container>
  
    )
  }