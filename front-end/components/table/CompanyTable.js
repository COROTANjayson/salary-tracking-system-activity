import React, {useState, useEffect} from "react";
import {
    Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,
  Button,
  Typography,
  Box,
  } from '@mui/material';
import _ from 'lodash'
import { useSelector , useDispatch } from 'react-redux';
import { getCompaniesAPI } from "../../pages/api/company";
import { AddCompanyModal } from "../modal/AddCompanyModal";
import { UpdateCompanyModal } from "../modal/UpdateCompanyModal";
import { DeleteCompanyModal } from "../modal/DeleteCompanyModal";
export const CompanyTable = () => {
    const counter = useSelector(state => state.company.counter)
    const [companies, setCompanies] = useState([])
    
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
        console.log('counter',counter)
        fetchCompanies()
    }, [counter])

    return(
        <Container>
            <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
                <Typography variant="h5" component="span">
                    Companies
                </Typography>
                <AddCompanyModal/>
            </Box> 
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{background: '#0ea5e9'}}>
                    <TableRow >
                        <TableCell sx={{ color: '#ffffff'}}>ID</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Company Name</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Leaves</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}>Overtime Limit</TableCell>
                        <TableCell sx={{ color: '#ffffff'}}></TableCell>
                        <TableCell sx={{ color: '#ffffff'}}></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {companies.map((row, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell >{row.name}</TableCell>
                        <TableCell >{row.allowableLeaves}</TableCell>
                        <TableCell >{row.allowableOvertime}</TableCell>
                        <TableCell >
                            <UpdateCompanyModal id={row.id}/>
                        </TableCell>
                        <TableCell >
                            <DeleteCompanyModal companyID = {row.id}/>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}



