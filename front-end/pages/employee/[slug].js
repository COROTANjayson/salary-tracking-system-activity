
import { useRouter } from "next/router"
  
import React, {useState, useEffect} from "react";
import { Box } from '@mui/material';
import EmployeeDetails from '../../components/sub-pages/employee-details' 
import Layout from '../../components/layout' 
import { verifyToken } from "../../pages/api/jwt";
import DotLoader from "react-spinners/DotLoader";

  export default function EmployeeProfile() {
    const router = useRouter()
    const empID = router.query.slug

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
              <EmployeeDetails employeeID={empID}/>
          </Layout>)
      }
      </div>
    )
  }
  
  