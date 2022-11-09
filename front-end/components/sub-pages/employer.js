import React, { useEffect, useState } from "react";
import _ from 'lodash'
import {
    Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,
  Button,
  Typography,
  Box,
  Link,
  } from '@mui/material';
import { Edit, Pageview, PersonAddAlt1, Delete} from '@mui/icons-material';
import { useSelector ,useDispatch } from 'react-redux';
import { 
    removeEmployee,
} from '../../store/reducers/employee';
import { removeAccount } from "../../store/reducers/account";
import { verifyToken } from "../../pages/api/jwt";
import { getProfile } from "../../pages/api/profile";
import { getEmployees, deleteEmployee, getEmployee } from "../../pages/api/employee";
import { getEmployer } from "../../pages/api/employer";


export default function Employer() {
  return (
    <div >
        <EmployeeList/>
    </div>
  )
}

const EmployeeList = () =>{
    const [employer, setEmployer] = useState({})
    useEffect(() => {
        const token = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined
     
        const fetchEmployer = async () => {
            const payload = await verifyToken(token)
            // return false if not token is invalid
            if(payload !== false){
                const accountData = payload.data
                    try {
                        // console.log(accountData.id)
                        const response = await getEmployer(accountData.id)
                        setEmployer(await response.data)
                    } catch(err) {
                        if(err.response) {
                            console.log(err.response)
                        } else {
                            console.log('Error: ', err.message)
                        }
                    }
                
            }
        }
        if(token !== undefined){
            fetchEmployer()
        }
    }, [])

    return (
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
                        {employer.firstName + ' '+ employer.lastName}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ color: '#ffffff'}}>
                        Employer
                    </Typography>
                </Box>
                <Typography variant="h5" component="div" sx={{ color: '#ffffff'}}>
                    {employer.name}
                </Typography>
            </Box>
        </Box>
        <EmployeeTable companyID = {employer.companyId}/>
    </Container>
    )
}

const EmployeeTable = (props) => {
    const [employees, setEmployees] = useState([])
    const {companyID} = props
    const [counter, setCounter] = useState(0)
    
    useEffect(()=>{    
        const fetchEmployees = async () => {
            try {
                const response = await getEmployee(companyID);
                setEmployees(await response.data)
            } catch(err) {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log('Error: ', err.message)
                }
            }
        }
        console.log('counter',counter)
        if(companyID){
            fetchEmployees()
        }
        
    }, [counter, companyID])
        return(
            <Container maxWidth='xl' height='100'>
                <Box mb={1} sx={{ 
                    marginBottom: 2,
                    margingTop: 2,
                    padding: 2.5,
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderRadius: 4, 
                    boxShadow: 2,
                    backgroundColor: '#ffffff'}} >  
                    <Typography variant="h5" component="span">
                        Employee List
                    </Typography>
                    <Link href="/employee/form">
                        <Button variant="contained" endIcon={<PersonAddAlt1 />}>
                            Add Employee
                        </Button>
                    </Link>
                    
                </Box> 
                <TableContainer component={Paper} sx={{borderRadius: 6 }}>
                    <Table 
                     aria-label="simple table">
                        <TableHead sx={{background: '#0ea5e9'}}>
                            <TableRow >
                                <TableCell sx={{ color: '#ffffff'}}>Employee Name</TableCell>
                                <TableCell sx={{ color: '#ffffff'}}>Employee ID</TableCell>
                                <TableCell sx={{ color: '#ffffff'}}>Email</TableCell>
                                <TableCell sx={{ color: '#ffffff'}}>Salary per hour</TableCell>
                                <TableCell sx={{ color: '#ffffff'}}></TableCell>
                                <TableCell sx={{ color: '#ffffff'}}></TableCell>
                                <TableCell sx={{ color: '#ffffff'}}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((row, index) => {
                                        return(
                                            <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.firstName} {row.lastName}
                                                </TableCell>
                                                <TableCell >{row.id}</TableCell>
                                                <TableCell >{row.email}</TableCell>
                                                <TableCell >{row.salaryPerHR}</TableCell>
                                                <TableCell >
                                                    <Link href={"/employee/"+row.id}>
                                                        <Button>
                                                            <Pageview color="secondary"></Pageview>
                                                        </Button>
                                                    </Link> 
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Link href={"/employee/form/"+row.id}>
                                                        <Button>
                                                            <Edit color="primary"></Edit>
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                                <TableCell >
                                                    <Button onClick={() => {
                                                        deleteEmployee(row.id, row.accountId).then(res =>{
                                                            console.log(res.request.status)
                                                            
                                                        }).catch((res) => {
                                                            const statusCode = res.response.request.status
                                                            console.log(statusCode)
                                                        })
                                                        setCounter(counter+1)
                                                        
                                                        }}>
                                                        <Delete sx={{color: 'red'}}></Delete>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                   
                                }
                            )}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        )
}







