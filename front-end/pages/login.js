
import React,{useEffect, useState} from "react";
import {
  Container,
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  } from '@mui/material';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/router";
import _ from 'lodash'
import { loginAccount } from '../store/reducers/login';
import axios from 'axios'
import { login, verifyToken } from "./api/login";
// import { useRouter } from "next/router"


export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isError, setError] = useState(false)
  const accountList = useSelector(state => state.account.accountList)
  
  const [accounts, setAccount] = useState('')

  useEffect(() => {
    const token = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined

    const fetchAccount = async () => {
      const payload = await verifyToken(token)
      if(payload !== false){
        router.push('/dashboard')
      }
  }
  if(token !== null ){
    fetchAccount()
  }
    
  }, [])

const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
   
    const credentials = {
        email: data.get('email'),
        password: data.get('password')
    }
    const statusCode = 0
    const result = ''
    await login(credentials)
    .then(res => {
      statusCode = res.request.status
      result = res.data
    })
    .catch((res) => {
      statusCode = res.response.request.status
      result = res.response.data
    })
    
    console.log(statusCode)
    const accountData = ''
    if(statusCode === 400){
      setError(true)
    } else {
      setError(false)
      localStorage.setItem('token', JSON.stringify(result.token))
      const payload = await verifyToken(result.token)
      if(payload !== false){
        accountData = payload.data
      }
    }
    
    if(!_.isEmpty(accountData)) {
      dispatch(loginAccount(accountData))

      if(accountData.role === 'employer'){
        router.push('/dashboard')
      }
      if(accountData.role === 'employee'){
        router.push(`/dashboard?role=${accountData.role}`)
      }
      if(accountData.role === 'admin'){
        console.log('admin')
        router.push(`/dashboard?role=${accountData.role}`)
      }
    }
    
    
  };
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {(isError)? <Box sx={{border: 1, borderColor: 'red', padding: 1, margin: 1, borderRadius: 2}}>Email or password is incorrect</Box> : <></>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
          </Box>
        </Box>
      </Container>
       
    </div>
  )
}
