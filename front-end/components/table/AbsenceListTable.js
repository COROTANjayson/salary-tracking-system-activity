import _ from "lodash";
import {
    Container,
    Box,
    Button,
    Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,
    } from '@mui/material';
import { Delete} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useEffect} from "react";
import { setCounter } from "../../store/reducers/employee";
import {AbsentModal} from "../modal/AbsentModal"
import { getAbsence, deleteAbsence } from "../../pages/api/employee";
export const AbsenceListTable = (props) =>{
  const dispatch = useDispatch()
    const { employeeId} = props
    const [absences, setAbsences] = useState([]);
    const counter = useSelector(state => state.employee.counter)

    useEffect(() => {
      const fetchAbsences = async () => {
        try {
            const response = await getAbsence(employeeId);
            setAbsences(await response.data)
        } catch(err) {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log('Error: ', err.message)
            }
        }
    }
    fetchAbsences()
    }, [counter, employeeId])
    return(
      <Container>
      <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
          <Typography variant="h6" component="span">
              Absences
          </Typography>
          <AbsentModal employeeId ={employeeId}/>
      </Box>
      <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
      <TableContainer component={Paper}  >
          <Table  aria-label="simple table">
              <TableHead sx={{background: '#0ea5e9'}} align="center">
              <TableRow >
                  <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                  <TableCell sx={{ color: '#ffffff'}}>Date Stated</TableCell>
                  <TableCell sx={{ color: '#ffffff'}}>Date Ended</TableCell>
                  <TableCell></TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {absences.map((row, index) => (
                  <TableRow
                  key={index}
                  >
                  <TableCell component="th" scope="row">
                      {row.reason}
                  </TableCell>
                  <TableCell >{new Date(row.dateStarted).toLocaleDateString()}</TableCell>
                  <TableCell >{new Date(row.dateEnded).toLocaleDateString()}</TableCell>
                  <TableCell >
                            <Button 
                            onClick={() =>{
                              deleteAbsence(row.id).then(res =>{
                                dispatch(setCounter())
                            }).catch((res) => {
                                console.log(res)
                            })
                            }}>
                                <Delete sx={{color: 'red'}}/>
                            </Button>
                  </TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
      </TableContainer>
      </Box> 
    </Container>
    )
  }

  export const DisplayAbsenceListTable = (props) =>{
      const { employeeId} = props
      const [absences, setAbsences] = useState([]);
  
      useEffect(() => {
        const fetchAbsences = async () => {
          try {
              const response = await getAbsence(employeeId);
              setAbsences(await response.data)
          } catch(err) {
              if(err.response) {
                  console.log(err.response)
              } else {
                  console.log('Error: ', err.message)
              }
          }
      }
      fetchAbsences()
    
      }, [employeeId])
      return(
        <Container>
        <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
            <Typography variant="h6" component="span">
                Absences
            </Typography>
        </Box>
        <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        <TableContainer component={Paper}  >
            <Table  aria-label="simple table">
                <TableHead sx={{background: '#0ea5e9'}} align="center">
                <TableRow >
                    <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                    <TableCell sx={{ color: '#ffffff'}}>Date Stated</TableCell>
                    <TableCell sx={{ color: '#ffffff'}}>Date Ended</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {absences.map((row, index) => (
                    <TableRow
                    key={index}
                    >
                    <TableCell component="th" scope="row">
                        {row.reason}
                    </TableCell>
                    <TableCell >{new Date(row.dateStarted).toLocaleDateString()}</TableCell>
                    <TableCell >{new Date(row.dateEnded).toLocaleDateString()}</TableCell>
                    
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Box> 
      </Container>
      )
    }