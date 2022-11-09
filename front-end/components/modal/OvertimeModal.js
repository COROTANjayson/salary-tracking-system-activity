import _ from "lodash";
import {
    Stack,
    Button,
    TextField,
    Box,
    Typography,
    Modal,
    } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useDispatch } from 'react-redux';
import React, {useState} from "react";
import { 
  setCounter

} from '../../store/reducers/employee';
import {createOvertime} from '../../pages/api/employee'

export const OvertimeModal = (props) => {
    const dispatch = useDispatch();
    
    const {employeeId} = props
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [date, setDate] = useState(new Date());
    
    const handleSubmit = async(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

    
      const overtime= {
        reason: data.get('reason'),
        date: new Date(date).toLocaleString(),
        timeStarted: new Date(startTime).toLocaleString(),
        timeEnded:  new Date(endTime).toLocaleString(),
        approved: false
        } 
        const statusCode = 0
        const result = ''
        
        await createOvertime(employeeId, overtime).then(res => {
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
          setOpen(false)
          dispatch(setCounter())
        } 
        if(statusCode === 404) {
          console.log('id not found')
        }
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      };
    
    return(
        <div>
            <Button onClick={handleOpen}  variant="contained" >
                Request Overtime
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} textAlign= 'center'> 
            <Typography variant="h5" component="span" >
                Request Form
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                <Stack spacing={2}>   
                  <TextField
                      id="outlined-required"
                      label="Reason"
                      name="reason"
                    />
                  <LocalizationProvider
                   dateAdapter={AdapterDayjs}
                   >
                    <DatePicker
                      label="Date and time started"
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> 
                    <TimePicker
                      label="Time started"
                      value={startTime}
                      onChange={(newValue) => {
                        setStartTime(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> 
                    <TimePicker
                      value={endTime}
                      onChange={(newValue) => {
                        setEndTime(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> 
                  </LocalizationProvider>
                  <Button type="submit" className="button" variant="contained">Submit</Button>
                </Stack>
                </Box>
            </Box>
        </Modal>
        </div>
    )
}