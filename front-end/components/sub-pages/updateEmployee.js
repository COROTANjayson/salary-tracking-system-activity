import _ from "lodash";
import React, {useEffect, useState} from "react";
import {
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
    Box,
    Typography,
    } from '@mui/material';
import { useRouter } from "next/router";
import {
    getCompanies
} from '../../store/reducers/company'
import { useSelector, useDispatch } from 'react-redux';
import { getEmployee, updateEmployee } from "../../pages/api/employee";
import { updateProfile } from "../../pages/api/profile";

export default function AddEmployee(props) {
  const {employeeID} = props
  return (
    <Box sx={{ flexGrow: 1 }}>
        <EmployeeUpdateForm employeeID={employeeID} />
    </Box>
  )
}

const EmployeeUpdateForm = (props) => {
    const router = useRouter();
    const {employeeID} = props
    const [emailAvalilable, setEmailAvalilable] = useState(false);
    const [empData, setEmpData] = useState({
        employeeType: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        accociatedCompany: '',
        salaryPerHR: 0,
    })
   
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
    },[employeeID])
    
    const handleChange = (event) => {
        const {name, value} = event.target
        setEmpData(
             {...empData, [name]: value}
        )
    }
    const errorElement = <Box sx={{textAlign: 'center', color: 'red'}}>Email already exist!</Box>
    
    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const employeeStatus = 0
        const accountStatus = 0
        const employeeData = {
            employeeType: data.get('employmentType'),
            companyId: empData.companyId,
            salaryPerHR: data.get('salaryPerHR'),
        }
        const accountData = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            password: data.get('password'),
        }
        await updateEmployee(employeeID,employeeData).then(res => {
            employeeStatus = res.request.status
            result = res.data
        }).catch((res) => {
          employeeStatus = res.response.request.status
         
        })
        await updateProfile(empData.accountId,accountData).then(res => {
          accountStatus = res.request.status
          result = res.data
      }).catch((res) => {
        accountStatus = res.response.request.status
      })
    
      if(accountStatus ===200 && employeeStatus === 200) {
        setEmailAvalilable(false)
        router.push('/dashboard')
    
      } 
      if(accountStatus ===404 && employeeStatus === 404) {
        setEmailAvalilable(true)
      }
    }
      
    return (
        <div>
                <Container maxWidth="xs">
                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                        
                    <Typography component="h2" variant="div">
                        Update Employee
                    </Typography>
                    <Typography component="h4" variant="div" >
                        Company: {empData.name}
                    </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                            margin="normal"
                            required
                            fullWidth 
                            id="first-name" 
                            label="First Name" 
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                            value={empData.firstName}
                            onChange={handleChange}

                            />
                            <TextField 
                            margin="normal"
                            required
                            fullWidth 
                            id="last-name" 
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            autoFocus
                            value={empData.lastName}
                            onChange={handleChange}
                            />
                            
                            <TextField
                            margin="normal"
                            disabled
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={empData.email}
                            onChange={handleChange}
                            />
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={empData.password}
                            onChange={handleChange}
                            />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="demo-simple-select-label">Employee Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="employmentType"
                                
                                label="Employee Type"
                                value={empData.employeeType}
                                onChange={handleChange}
                            >
                                <MenuItem value='full-time'>Full Time</MenuItem>
                                <MenuItem value='part-time'>Part Time</MenuItem>
                            </Select>
                        </FormControl>
                            <TextField 
                            id="salary-per-hour" 
                            label="Salary/hr" 
                            margin="normal"
                            required
                            fullWidth
                            name="salaryPerHR"
                            type='number'
                            value={empData.salaryPerHR}
                            onChange={handleChange}
                            />
                            {(emailAvalilable)? errorElement : <></>}
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Update Employee{}
                                </Button>
                        </Box>
                    </Box>
                </Container>
        </div>
    )
    
}
