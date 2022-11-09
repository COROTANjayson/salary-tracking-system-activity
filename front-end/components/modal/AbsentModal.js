
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from 'react-redux';
import React, {useState} from "react";
import {createAbsence} from '../../pages/api/employee'
import {
  setCounter
} from '../../store/reducers/employee';

export const AbsentModal = (props) => {
    const dispatch = useDispatch();
    const {employeeId} = props
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose= () => setOpen(false);

    const handleSubmit = async(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
        const absence = {
            reason: data.get('reason'),
            dateStarted: new Date(startDate).toLocaleString(),
            dateEnded: new Date(endDate).toLocaleString(),
        }
        const statusCode = 0
        const result = ''
        
        await createAbsence(employeeId, absence).then(res => {
          // console.log(res)
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
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    return(
        <div>
            <Button onClick={handleOpen}  variant="contained" >
                Absent
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} textAlign= 'center'> 
            <Typography variant="h5" component="span" >
                Absent Form
            </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              
                  <Stack spacing={2}>   
                    <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    >
                      <DatePicker
                        disableFuture
                        label="Date Started"
                        openTo="day"
                        views={['day']}
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                        }}
                        inputFormat="MM/DD/YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      /> 
                      <DatePicker
                        disableFuture
                        label="Date Ended"
                        openTo="day"
                        views={['day']}
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
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