import React, {useState, useEffect} from "react";
import {
    Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,
  Button,
  Typography,
  Box,
 Link,
  } from '@mui/material';
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { Edit, PersonAddAlt1, Delete} from '@mui/icons-material';
import { getEmployers } from "../../pages/api/employer";

import { deleteEmployer } from "../../pages/api/employer";

export const EmployerTable = () => {
  
    const [employers, setEmployers] = useState([])
    const [counter, setCounter] = useState(0)
  
    useEffect(()=>{
        const fetchEmployers = async () => {
            try {
                const response = await getEmployers();
                setEmployers(await response.data)
            } catch(err) {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log('Error: ', err.message)
                }
            }
        }
        fetchEmployers()
    }, [counter])
    return(
        <Container>
            <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
                <Typography variant="h5" component="span">
                    Employers
                </Typography>
                <Link href={"/employer/form"}>
                    <Button variant="contained" endIcon={<PersonAddAlt1 />}>
                        Add Employer
                    </Button>
                </Link>
            </Box> 
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{background: '#0ea5e9'}}>
                    <TableRow >
                        <TableCell sx={{ color: '#ffffff'}}>ID</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Company Name</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Email</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>First Name</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Last Name</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Password</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}></TableCell>
                        <TableCell sx={{ color: '#ffffff'}}></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {employers.map((row, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell >{row.name}</TableCell>
                        <TableCell >{row.email}</TableCell>
                        <TableCell >{row.firstName}</TableCell>
                        <TableCell >{row.lastName}</TableCell>
                        <TableCell >{row.password}</TableCell>
                        <TableCell >
                            <Link href={"/employer/form/"+ row.id}>
                                <Button variant="contained" startIcon={<Edit />}>
                                    Edit
                                </Button>
                            </Link>
                        </TableCell>
                        <TableCell >
                            <Button variant="contained"  sx={{backgroundColor:'red'}}  startIcon={<Delete />} 
                            onClick={()=>{
                                
                                deleteEmployer(row.id, row.accountId).then(res =>{
                                    console.log(res.request.status)
                                    
                                }).catch((res) => {
                                    const statusCode = res.response.request.status
                                    console.log(statusCode)
                                })
                                setCounter(counter+1)
                                }}>
                                Delete
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}
