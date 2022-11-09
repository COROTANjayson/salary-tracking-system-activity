import React, {useState} from "react";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Box,
  } from '@mui/material';
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { createCompany } from "../../pages/api/company";
import  { 
    addCompany,
    getCompanies,
    setCounter 
} from '../../store/reducers/company';
import { PersonAddAlt1} from '@mui/icons-material';

export const AddCompanyModal = (props) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const companyList = useSelector(getCompanies);
    const [compExist, setCompExist] = useState(false)

    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const companyData = {
                    name: data.get('companyName'),
                    allowableLeaves: parseInt(data.get('leaves')),
                    allowableOvertime: parseInt(data.get('overtimeLimit')),
                
                }
        const statusCode = 0
        const result = ''
        await createCompany(companyData)
        .then(res => {
          statusCode = res.request.status
          console.log(statusCode)
          result = res.data
        })
        .catch((res) => {
          console.log(res)
          statusCode = res.response.request.status
          console.log(statusCode)
          result = res.response.data
        })
        
        if(statusCode ===201) {
            dispatch(setCounter())
            setCompExist(false)
            setOpen(false)
        } 
        if(statusCode === 409) {
            setCompExist(true)
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
        borderRadius: 4
      };
    return(
        <div>
            <Button onClick={handleOpen}  variant="contained" endIcon={<PersonAddAlt1/>} >
                Add Company
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
                <Box 
                component="form" onSubmit={handleSubmit}
                sx={{ mt: 1 }}
                >
                    <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="company-name" 
                    label="Company Name" 
                    name="companyName"
                    />
                    <TextField 
                    margin="normal"
                    required
                    fullWidth 
                    id="leaves" 
                    label="Leaves"
                    name="leaves"
                    type="number"
                    InputProps={{
                        inputProps: { min: 0
                        }
                    }}
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="overtime-limit"
                    label="Overtime Limit-hr/s"
                    name="overtimeLimit"
                    type="number"
                    InputProps={{
                        inputProps: { min: 0
                        }
                    }}
                    />
                     {(compExist) ? <Typography variant="p" sx={{color: 'red'}}>company already exist!</Typography>: <></>}
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Add Company
                    </Button>
                </Box>
            </Box>
        </Modal>
        </div>
    )
}