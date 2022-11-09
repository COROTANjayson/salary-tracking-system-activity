import { useRouter } from "next/router"
import {
    Box,
    } from '@mui/material';
// import Layout from 
import Layout from '../../components/layout' 
import Employee from '../../components/sub-pages/employee' 
import Employer from '../../components/sub-pages/employer' 
import Admin from '../../components/sub-pages/admin' 
import {useEffect, useState} from 'react'
import { verifyToken } from "../../pages/api/jwt";
import DotLoader from "react-spinners/DotLoader";

export default function Dashboard() {
    const router = useRouter()
    
    const [isLoading, setLoading] = useState(true)
    const [account, setAccount] = useState({})
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
            const account = payload.data
            setAccount(account)
            if(account.role === 'admin'){
                router.push(`/dashboard?role=${account.role}`)
            }
            if(account.role === 'employee'){
                router.push(`/dashboard?role=${account.role}`)
            }
            if(account.role === 'employer'){
                router.push(`/dashboard`)
            }
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
    

    let element = <Employer/>
    if(router.query.role == 'employee' || account.role == 'employee'){
        element = <Employee/>
    }
    if(router.query.slug == 'admin' || account.role == 'admin'){
        element = <Admin/>
    }
    return(
        <div>
            {(isLoading) ? (
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
                    {element}
                </Layout>)
            }
        </div>
    )
}