

import {
  Container,
  Avatar,
  Stack,
  Divider,
  
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import _ from 'lodash'
import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import Layout from '../components/layout'
import { UpdateProfileModal } from '../components/modal/UpdateProfile';
import DotLoader from "react-spinners/DotLoader";
import { verifyToken } from "../pages/api/jwt";
import { getProfile } from './api/profile';
import { useRouter } from "next/router"

export default function Profile() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(true)
  const counter = useSelector(state => state.employee.counter)
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#7dd3fc",
  };

  const fetchAccount = async (token) => {
    const payload = await verifyToken(token)
    if(payload === false){
      router.push('/login')
    } else {
        const accountData = payload.data
            try {
                const response = await getProfile(accountData.id)
                setProfile(await response.data)
                setLoading(false)
            } catch(err) {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log('Error: ', err.message)
                }
            }
    }
}

  const [profile, setProfile] = useState({})
  useEffect(()=>{
    const token = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined
   
    if(token === null ){
      router.push('/login')
    } else {
      fetchAccount(token)
    }
  console.log('counter',counter)
  }, [counter])

  return(
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
              <ProfileDetails profile={profile}/>
            </Layout>)
      }
    </div>
   
  )
}

const ProfileDetails = (props) => {
  const {profile} = props


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
            <Avatar sx={{ m: 1, bgcolor: 'primary.main',  width: 56, height: 56 }}>
                <AccountCircleIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Profile
            </Typography>
            <Box minWidth={400} p= {1} sx={{ borderRadius: 2, boxShadow: 2 }} backgroundColor= 'white'>
              <Stack>
                <Box m={1}>
                  <Typography variant="p" component="div" >
                    Name
                  </Typography>
                  <Typography variant="h6">
                      {profile.firstName} {profile.lastName}
                  </Typography>
                </Box>
                <Divider sx={{marginTop: '2'}}/>
                <Box m={1}>
                  <Typography variant="p" component="div" >
                    Email
                  </Typography>
                  <Typography variant="h6">
                    {profile.email}
                  </Typography>
                </Box>
                <Divider sx={{marginTop: '2'}}/>
                <Box m={1}>
                  <Typography variant="p" component="div" >
                    Password
                  </Typography>
                  <Typography variant="h6" component="span">
                    {profile.password}
                  </Typography>
                </Box>
                <Divider sx={{marginTop: '2'}}/>
              </Stack>
            </Box>
            <UpdateProfileModal profile={profile}/>
        </Box>
      </Container>
       
    </div>
  )
}