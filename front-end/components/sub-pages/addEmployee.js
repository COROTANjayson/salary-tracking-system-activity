import React, {useState, useEffect} from "react";
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


import {
    getCompanies
} from '../../store/reducers/company'

import { useRouter } from "next/router";
import { createEmployee } from "../../pages/api/employee";
import {getEmployer } from "../../pages/api/employer";

import { verifyToken } from "../../pages/api/jwt";
export default function AddEmployee() {
    const log = useSelector(state => state.login.loginCred)
    const companyList = useSelector(getCompanies)
   
    const [employer, setEmployer] = useState({})
    const [company, setCompany] = useState({})

    useEffect(() => {
        
        const data = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : null
        
        const fetchAccount = async () => {
            const payload = await verifyToken(data)
            // return false if not token is invalid
            if(payload !== false){
                const accountData = payload.data
                    try {
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
        fetchAccount()
    }, [])
  return (
    <Box sx={{ flexGrow: 1 }}>
        <EmployeeAddForm employer={employer}/>
    </Box>
  )
}

const EmployeeAddForm = (props) => {
    const router = useRouter();
    const [employmentType, setEmploymentType] = useState('full-time');
    const [emailAvalilable, setEmailAvalilable] = useState(false);

 

    const {employer} = props

    const employmentHandelChange = (event) => {
        setEmploymentType(event.target.value);
    };
    const errorElement = <Box sx={{textAlign: 'center', color: 'red'}}>Email already exist!</Box>
    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const employeeData = {
            employeeType: employmentType,
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
            companyId: employer.companyId,
            salaryPerHR: data.get('salaryHR'),
            role: "employee",
        }
        const statusCode = 0
        const result = ''
        await createEmployee(employeeData).then(res => {
            statusCode = res.request.status
            console.log(statusCode)
            result = res.data
        }).catch((res) => {
            console.log(res)
            statusCode = res.response.request.status
            console.log(statusCode)
            result = res.response.data
        })
        
        if(statusCode ===201) {
            setEmailAvalilable(false)
            router.push('/dashboard')

        } 
        if(statusCode === 409) {
            setEmailAvalilable(true)
        }
        
    };
    return (
        <div>
        <Container maxWidth="sm">
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                padding: 3,
                boxShadow: 3,
                borderRadius: 6
            }}
            >
            <Typography component="h2" variant="div">
                        Add Employee
            </Typography>
            <Typography component="h4" variant="div" >
                        Company: {employer.name}
            </Typography>
                <Box 
                component="form" onSubmit={handleSubmit} 
                sx={{ mt: 1 }}
                >
                    <Box sx={{display:"flex"}}>
                        <TextField
                        margin="normal"
                        sx={{mr:1}}
                        required
                        fullWidth 
                        id="first-name" 
                        label="First Name" 
                        name="firstName"
                
                        />
                        <TextField 
                        margin="normal"
                        required
                        fullWidth 
                        id="last-name" 
                        label="Last Name"
                        name="lastName"
                        />
                    </Box>
                   
                    <Box sx={{display: 'flex'}}>
                        <TextField
                        margin="normal"
                        sx={{mr:1}}
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        />
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        />
                    </Box>
                    
                    <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Employee Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={employmentType}
                        label="Employee Type"
                        onChange={employmentHandelChange}
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
                    name="salaryHR"
                    type='number'
                    InputProps={{
                        inputProps: { min: 0
                        }
                    }}
                   
                    />
        
                    {(emailAvalilable)? errorElement : <></>}
                  
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Add Employee
                        </Button>
                </Box>
            </Box>
        </Container>
            
        </div>
    )
    
}
