import _ from "lodash";
import {
    Container,
    Button,
    Box,
    Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,
    } from '@mui/material';
import { Delete} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useEffect} from "react";
import {OvertimeModal} from '../modal/OvertimeModal'
import { setCounter } from "../../store/reducers/employee";
import { getOvertime, deleteOvertime, updateOvertime } from "../../pages/api/employee";

export const OverTimeListTable = (props) =>{
  const dispatch = useDispatch()
  const {overtimeList, employeeId} = props
  const [overtime, setOvertime] = useState([]);
  const [counter, setCount] = useState(0);

  useEffect(() => {
    const fetchOvertime = async () => {
      try {
          const response = await getOvertime(employeeId);
          setOvertime(await response.data)
      } catch(err) {
          if(err.response) {
              console.log(err.response)
          } else {
              console.log('Error: ', err.message)
          }
      }
  }
  fetchOvertime()
  }, [counter])
  return(
    <Container>
    <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
        <Typography variant="h6" component="span">
            Overtime
        </Typography>
    </Box>
    <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
    <TableContainer component={Paper} >
        <Table  aria-label="simple table">
            <TableHead sx={{background: '#0ea5e9'}} align="center">
            <TableRow >
                <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Date</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Started</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Ended</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {overtime.map((row, index) => {
              if(row.approved === true){
              return (
                    <TableRow
                    key={index}
                    >
                      <TableCell >{row.reason}</TableCell>
                      <TableCell >{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell >{new Date(row.timeStarted).toLocaleTimeString()}</TableCell>
                      <TableCell >{new Date(row.timeEnded).toLocaleTimeString()}</TableCell>
                      <TableCell >
                          <Button 
                          onClick={() =>{
                              deleteOvertime(row.id).then(res =>{
                                console.log(res.request.status)
                                setCount(counter+1)
                                dispatch(setCounter())
                                  }).catch((res) => {
                                      // const statusCode = res.response.request.status
                                      console.log(res)
                                  })
                          }}>
                              <Delete sx={{color: 'red'}}/>
                          </Button>
                        </TableCell>
                    </TableRow>
                  )
                }   
              }
            )}
            </TableBody>
        </Table>
    </TableContainer>
    </Box> 
  </Container>
  )
}

export const DisplayOverTimeListTable = (props) =>{
    const {employeeId} = props
    const [overtime, setOvertime] = useState([]);
    useEffect(() => {
      const fetchOvertime = async () => {
        try {
            const response = await getOvertime(employeeId);
            setOvertime(await response.data)
        } catch(err) {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log('Error: ', err.message)
            }
        }
    }
    fetchOvertime()
    }, [])
    return(
      <Container>
      <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
          <Typography variant="h6" component="span">
              Overtime
          </Typography>
      </Box>
      <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
      <TableContainer component={Paper} >
          <Table  aria-label="simple table">
              <TableHead sx={{background: '#0ea5e9'}} align="center">
              <TableRow >
                <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Date</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Started</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Ended</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {overtime.map((row, index) => {
                if(row.approved === true){
                  return(
                    <TableRow
                    key={index}
                    >
                      <TableCell >{row.reason}</TableCell>
                      <TableCell >{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell >{new Date(row.timeStarted).toLocaleTimeString()}</TableCell>
                      <TableCell >{new Date(row.timeEnded).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  )}
                }
              )}
              </TableBody>
          </Table>
      </TableContainer>
      </Box> 
    </Container>
    )
  }

export const RequestOverTimeListTable = (props) =>{
    const dispatch = useDispatch()
    const {employeeId} = props
    const [overtime, setOvertime] = useState([]);
    const [counter, setCount] = useState(0);

    useEffect(() => {
      const fetchOvertime = async () => {
        try {
            const response = await getOvertime(employeeId);
            setOvertime(await response.data)
        } catch(err) {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log('Error: ', err.message)
            }
        }
    }
    fetchOvertime()
    }, [counter])
    return(
      <Container>
      <Box mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }} >  
          <Typography variant="h6" component="span">
              Request Overtime
          </Typography>
      </Box>
      <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
      <TableContainer component={Paper} >
          <Table  aria-label="simple table">
              <TableHead sx={{background: '#0ea5e9'}} align="center">
              <TableRow >
                <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Date</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Started</TableCell>
                <TableCell sx={{ color: '#ffffff'}}>Time Ended</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {overtime.map((row, index) => {
                if(row.approved === false){
                  return(
                    <TableRow
                    key={index}
                    >
                      <TableCell >{row.reason}</TableCell>
                      <TableCell >{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell >{new Date(row.timeStarted).toLocaleTimeString()}</TableCell>
                      <TableCell >{new Date(row.timeEnded).toLocaleTimeString()}</TableCell>
                      <TableCell >
                          <Button  variant="contained"
                                  onClick={() =>{
                                    const overtime = {
                                      date: row.date,
                                      timeStarted: row.timeStarted, 
                                      timeEnded: row.timeEnded, 
                                      reason: row.reason, 
                                      approved: true}
                                      updateOvertime(row.id, overtime).then(res =>{
                                        console.log(res.request.status)
                                        dispatch(setCounter())
                                        setCount(counter+1)
                                    }).catch((res) => {
                                        console.log(res)
                                    })
                                }
                              }
                                  >
                                      Accept
                          </Button>
                      </TableCell>
                      <TableCell>
                          <Button sx={{background: 'red'}} variant="contained"
                            onClick={() =>{
                              deleteOvertime(row.id).then(res =>{
                                console.log(res.request.status)
                                setCount(counter+1)
                                dispatch(setCounter())
                                  }).catch((res) => {
                                      console.log(res)
                                  })
                          }
                        }
                          >
                              Decline
                        </Button>
                      </TableCell>
                          
                    </TableRow>
                    )
                } 
                }
              )}
              </TableBody>
          </Table>
      </TableContainer>
      </Box> 
    </Container>
    )
  }

  export const DisplayRequestOverTimeListTable = (props) =>{
    const dispatch = useDispatch()
    const { employeeId} = props
    const [overtime, setOvertime] = useState([]);
    const counter = useSelector(state => state.employee.counter)
  
    useEffect(() => {
      const fetchOvertime = async () => {
        try {
            const response = await getOvertime(employeeId);
            setOvertime(await response.data)
        } catch(err) {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log('Error: ', err.message)
            }
        }
    }
    fetchOvertime()
    }, [counter])
    return(
      <Container>
      <Box mb={1} sx={{ display: 'flex', justifyContent: 'flex-end' }} >  
          <OvertimeModal employeeId = {employeeId}/>
      </Box>
      <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
      <TableContainer component={Paper} >
          <Table  aria-label="simple table">
              <TableHead sx={{background: '#0ea5e9'}} align="center">
              <TableRow >
                  <TableCell sx={{ color: '#ffffff'}}>Reason</TableCell>
                  <TableCell sx={{ color: '#ffffff'}}>Date</TableCell>
                  <TableCell sx={{ color: '#ffffff'}}>Time Started</TableCell>
                  <TableCell sx={{ color: '#ffffff'}}>Time Ended</TableCell>
                  <TableCell></TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {overtime.map((row, index) => {
                  if(row.approved === false){
                    return(
                      <TableRow
                      key={index}
                      >
                      <TableCell >{row.reason}</TableCell>
                      <TableCell >{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell >{new Date(row.timeStarted).toLocaleTimeString()}</TableCell>
                      <TableCell >{new Date(row.timeEnded).toLocaleTimeString()}</TableCell>
                    <TableCell >
                        <Button sx={{background: 'red'}} variant="contained" startIcon={<Delete />}
                                onClick={() =>{
                                  deleteOvertime(row.id).then(res =>{
                                    console.log(res.request.status)
                                    dispatch(setCounter())
                                      }).catch((res) => {
                                          console.log(res)
                                      })
                              }}
                                >
                                Delete
                        </Button>
                    </TableCell>
                      </TableRow>
                  ) 
                }
              }
            )}
              </TableBody>
          </Table>
      </TableContainer>
      </Box> 
    </Container>
    )
  }