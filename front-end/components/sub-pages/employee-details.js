import _ from "lodash";
import {
    Container,
    Avatar,
    Stack,
    Divider,
    Box,
    Typography,
    Grid,
    Button,
    BottomNavigationAction,
    BottomNavigation
    } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector ,useDispatch } from 'react-redux';
import React, {useState, useEffect} from "react";
import { getCompanies } from "../../store/reducers/company";
import { LeaveListTable, RequestLeaveListTable } from "../table/LeaveListTable";
import { AbsenceListTable } from "../table/AbsenceListTable";
import { OverTimeListTable, RequestOverTimeListTable } from "../table/OverTimeListTable";
import { 
  getEmployee,
  getLeavesRemaining,
  getTotalAbsences,
  getTotalOvertime,
  getDailyWage,
  getMonthlySalary
} from "../../pages/api/employee";


export default function EmployeeDetails(props) {

    const {employeeID} = props
    const [requestNav, setRequestNav] = useState(0);
    const [empData, setEmpData] = useState({})
    useEffect(()=>{
        const fetchEmployee = async () => {
          if(employeeID){
              try {
              const response = await getEmployee(employeeID);
              setEmpData(await response.data)
              } catch(err) {
                  if(err.response) {
                      console.log(err.response)
                  } else {
                      console.log('Error: ', err.message)
                  }
              }
          }
      }
      fetchEmployee()
    }, [employeeID])
let table = <LeaveListTable leaveList={empData.leaves} employeeId= {employeeID} />
switch (requestNav) {
  case 0:
    table = <LeaveListTable leaveList={empData.leaves} employeeId= {employeeID} />
    break;
  case 1:
    table = <AbsenceListTable absenceList={empData.absence} employeeId= {employeeID}/>
    break;
  case 2:
      table = <OverTimeListTable overtimeList={empData.overtime} employeeId= {employeeID}/>
      break;
  case 3:
      table = <RequestLeaveListTable leaveList={empData.requestLeave} employeeId= {employeeID}/>
      break;
  case 4: 
      table = <RequestOverTimeListTable overtimeList={empData.requestOvertime} employeeId= {employeeID}/>
      break;
  default:
      table = <LeaveListTable leaveList={empData.leaves} employeeId= {employeeID} />
} 
    return (
      <div>
          <Container 
          sx={{marginTop: 2}}
          maxWidth="xl"
          >
            <Grid container spacing={2}>
              
              <Grid item xs={6} md={4}>
                <Box>
                  <Box sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: 2 }}>
                      <Avatar sx={{ m: 1, bgcolor: 'primary.main',  width: 60, height: 60 }}>
                          <AccountCircleIcon/>
                      </Avatar>
                      <Typography component="h1" variant="h5">
                        {empData.firstName} {empData.lastName} 
                      </Typography>
                  </Box>

                  <Box sx={{
                    mt: 2,
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: 2 }}>
                     
                     <Divider sx={{mt:1}} textAlign="left">Company</Divider>
                        <Typography textAlign="center" variant="body1" gutterBottom>
                          {empData.name} 
                        </Typography>
                      
                      <Divider sx={{mt:1}} textAlign="left">Employee ID</Divider>
                        <Typography textAlign="center" variant="body1" gutterBottom>
                          {empData.id} 
                        </Typography>

                      <Divider sx={{mt:1}} textAlign="left">Employment Type</Divider>
                        <Typography textAlign="center" variant="body1" gutterBottom>
                          {empData.employeeType} 
                        </Typography>
                        
                      <Divider sx={{mt:1}} textAlign="left">Email</Divider>
                        <Typography textAlign="center" variant="body1" gutterBottom>
                          {empData.email} 
                        </Typography>

                      <Divider sx={{mt:1}} textAlign="left">Password</Divider>
                        <Typography textAlign="center" variant="body1" gutterBottom>
                          {empData.password} 
                        </Typography>

                      <Button mt={2}>Update</Button>
                  </Box>
                </Box>
              </Grid>
                <Grid item xs={6} md={8}>
                  
                    <Box>
                      <SalaryDetails employeeID={employeeID} employee={empData}/>
                      <Container>
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
                      </Container>
                    </Box>
                </Grid>
            </Grid>
          </Container>
      </div>
    )
}

const SalaryDetails = (props) => {
  const counter = useSelector(state => state.employee.counter)

  const {employeeID, employee} = props
  const companyList = useSelector(getCompanies)
  // const [company, setCompany] = useState({})
  const dispatch = useDispatch()
  const [leavesRemaining, setLeavesRemainig] = useState(0)
  const [ttlAbsences, setTotalAbsences] = useState(0)
  const [ttlOvertime, setTotalOvertime] = useState(0)
  // const [totalLeaves, setTotalLeaves] = useState(0)
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
  },[counter, employeeID])
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
 






  