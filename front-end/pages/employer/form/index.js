
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
  import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/router";
import Layout from '../../../components/layout' 
import { 
  getEmployers
} from '../../../store/reducers/employer';

import { getCompaniesAPI } from "../../../pages/api/company";
import { createEmployer } from "../../../pages/api/employer";
import { verifyToken } from "../../../pages/api/jwt";
import DotLoader from "react-spinners/DotLoader";

export default function EmployerAddForm() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(true)
    
  const fetchAccount = async (token) => {
    const payload = await verifyToken(token)
    if(payload === false){
      router.push('/login')
    } else if (payload.data.role === 'employer'|| payload.data.role ==='employee' ){
      (console.log(payload.data.role))
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
            (<Layout>
              <EmployeeForm />
            </Layout> )
      }
      
  </div>
  )
}

const EmployeeForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [emailAvalilable, setEmailAvalilable] = useState(false);
  const employerList = useSelector(getEmployers)
  const [employers, setEmployers] = useState([])
  // const companies = useSelector(getCompanies)
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([])

  useEffect(()=>{
    // if(employerList){
    //     setEmployers(employerList)
    // }
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
  fetchCompanies()
}, [])
  const handleCompany = (event) => {
    setCompany(event.target.value);
  };
  const errorElement = <Box sx={{textAlign: 'center', color: 'red'}}>Email already exist!</Box>

  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

      const employerData = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
        role: 'employer',
        companyId: company,
    }
    // console.log(employerData)
    const statusCode = 0
    const result = ''
    await createEmployer(employerData).then(res => {
      // console.log(res)
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
      router.push("/dashboard?role=admin")

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
          <Box >
            <Typography component="h1" variant="h5">
              Add Employer
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{display:"flex"}}>
              <TextField
              sx={{mr:1}}
              margin="normal"
              required
              fullWidth 
              id="first-name" 
              label="First Name" 
              name="firstName"
              autoComplete="firstName"
              autoFocus
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
              />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="current-password"
            />
            <FormControl fullWidth margin="normal">
                  <InputLabel id="company">Associated Company</InputLabel>
                  <Select
                    required
                    labelId="company"
                    id="company"
                    value={company}
                    label="Employee Type"
                    onChange={handleCompany}
                  >
                    {companies.map((data, index)=>{
                      return(
                        <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
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
                  Add Employer
                </Button>
          </Box>
        </Box>
      </Container>
       
    </div>
  )
}