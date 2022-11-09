
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
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";
import Layout from '../../../components/layout' 
import { getCompaniesAPI } from "../../../pages/api/company";
import { updateEmployer, getEmployer } from "../../../pages/api/employer";
import { updateProfile } from "../../../pages/api/profile";
import DotLoader from "react-spinners/DotLoader";
import { verifyToken } from "../../../pages/api/jwt";


export default function EmployerAddForm(props) {
  const router = useRouter()
  const empID = router.query.slug
  
  const [isLoading, setLoading] = useState(true)
    
    const fetchAccount = async (token) => {
      const payload = await verifyToken(token)
      if(payload === false){
        router.push('/login')
      } else if (payload.data.role === 'employer'|| payload.data.role === 'employee' ){
          router.push('/dashboard') 
      } else {
        setLoading(false)
      }
  }
    useEffect(()=>{
      const token = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined
     
      if(token === null ){
        router.push('/login')
      } else {
        fetchAccount(token)
      }
    }, [])

    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "#7dd3fc",
    };
  
  return (
    <div>
      {
        (isLoading) ? (
          <Box sx={{display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: '100%',
          height: '100vh',}}>
          <DotLoader
              color={'#7dd3fc'}
              loading={isLoading}
              cssOverride={override}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Box>) :
            ( <Layout>
              <EmployerForm employerID={empID}/>
            </Layout> )
      }
      
  </div>
  )
}

const EmployerForm = (props) => {
  const {employerID} = props
  const dispatch = useDispatch()
  const router = useRouter()
  const [emailAvalilable, setEmailAvalilable] = useState(false);
  const [companies, setCompanies] = useState([])
  const [empData, setEmpData] = useState({
    id:'',
    accountId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyId: '',})
  useEffect(()=>{
    const fetchCompanies = async () => {
      try {
          const response = await getCompaniesAPI();
          setCompanies(await response.data)
      } catch(err) {
          if(err.response) {
              console.log(err.response)
          } else {
              console.log('Error: ', err.message)
          }
      }
  }
  const fetchEmployer = async () => {
    if(employerID){
      try {
        
        const response = await getEmployer(employerID);
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
  fetchEmployer()
  fetchCompanies()
    
  }, [employerID])
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
    
       const employerData = {
        companyId: data.get('companyId'),
    }
    const accountData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      password: data.get('password'),
  }
    const employerStatus = 0
    const accountStatus = 0
    const result = ''
    
    await updateEmployer(employerID,employerData).then(res => {
        employerStatus = res.request.status
        result = res.data
    }).catch((res) => {
      employerStatus = res.response.request.status
      console.log(employerStatus)
    })
    await updateProfile(empData.accountId,accountData).then(res => {
      accountStatus = res.request.status
      result = res.data
  }).catch((res) => {
    accountStatus = res.response.request.status
    console.log(accountStatus)
  })

  if(accountStatus ===200 && employerStatus === 200) {
    setEmailAvalilable(false)
    router.push("/dashboard?role=admin")

  } 
  if(accountStatus ===404 && employerStatus === 404) {
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
       
          <Typography component="h1" variant="h5">
            Edit Employer
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{display: 'flex'}}>
              <TextField
              margin="normal"
              required
              fullWidth 
              id="first-name-employer" 
              label="First Name" 
              name="firstName"
              value={empData.firstName}
              onChange={handleChange}
              />
              <TextField 
              margin="normal"
              sx={{ml:1}}
              required
              fullWidth 
              id="last-name" 
              label="Last Name"
              name="lastName"
              value={empData.lastName}
              onChange={handleChange}
              />
            </Box>
          
            
            <TextField
              margin="normal"
              disabled
              fullWidth
              id="email"
              label="Email Address"
              name="email"
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
              value={empData.password}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                  <InputLabel id="company">Associated Company</InputLabel>
                  <Select
                    labelId="company"
                    id="company"
                    name="companyId"
                    value={empData.companyId}

                    label="Employee Type"
                    onChange={handleChange}
                  >
                    {companies.map((data, i)=>{
                      return(
                        <MenuItem key={i} value={data.id}>{data.name}</MenuItem>
                      )
                    })}
              
                  </Select>
            </FormControl>

            {(emailAvalilable)? errorElement : <></>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Edit Employer
                </Button>
          </Box>
        </Box>
      </Container>
    </div>
  )
}
