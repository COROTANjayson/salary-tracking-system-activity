
import React, {useEffect, useState} from "react";
import AddEmployee from '../../../components/sub-pages/addEmployee' 
import Layout from '../../../components/layout' 
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { verifyToken } from "../../../pages/api/jwt";
import DotLoader from "react-spinners/DotLoader";
export default function EmployeeAddForm() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(true)
    
  const fetchAccount = async (token) => {
    const payload = await verifyToken(token)
    if(payload === false){
      router.push('/login')
    } else if (payload.data.role === 'admin'|| payload.data.role === 'employee' ){
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
              <AddEmployee/>
            </Layout> )
      }
      
    </div>
    
  )
}
