import React, {useState, useEffect} from "react";
import {
    Button,
    Modal,
    TextField,
    Typography,
    Box,
  } from '@mui/material';
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { updateCompany, getCompany } from "../../pages/api/company";
import  { 
    setCounter
} from '../../store/reducers/company';
import { Edit } from '@mui/icons-material';

export const UpdateCompanyModal = (props) => {
    const dispatch = useDispatch();
    const data = {
        name: '',
        leaves: '',
        overtimeLimit: '',
    }
    const {id} = props
    const [input, setInput] = useState({data})

    const [compExist, setCompExist] = useState(false)
    useEffect(()=>{
        const fetchCompany= async () => {
            try {
                const response = await getCompany(id);
                setInput(await response.data)
            } catch(err) {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log('Error: ', err.message)
                }
            }
        }
        fetchCompany()
    }, [])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const companyData = {
            allowableLeaves: parseInt(data.get('leaves')),
            allowableOvertime: parseInt(data.get('overtimeLimit')),
        
        }
        const statusCode = 0
        await updateCompany(id,companyData)
        .then(res => {
        statusCode = res.request.status
        result = res.data
        })
        .catch((res) => {
        statusCode = res.response.request.status
        result = res.response.data
        })

        if(statusCode ===200) {
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
      };
   
    return(
        <div>
            <Button onClick={handleOpen}>
                <Edit color="primary"></Edit>
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} textAlign= 'center'> 
            <Typography variant="h5" component="span" >
                Update Company
            </Typography>
                <Box 
                component="form" onSubmit={handleSubmit} 
                sx={{ mt: 1 }}
                >
                    <TextField
                    margin="normal"
                    disabled
                    fullWidth 
                    id="company-name" 
                    label="Company Name" 
                    name="companyName"
                    defaultValue={input.name}
                  
                    />
                    <TextField 
                    margin="normal"
                    required
                    fullWidth 
                    id="leaves" 
                    label="Leaves"
                    name="leaves"
                    type="number"
                    defaultValue={input.allowableLeaves}
                 
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="overtime-limit"
                    label="Overtime Limit-hr/s"
                    name="overtimeLimit"
                    type="number"
                    defaultValue={input.allowableOvertime}
                    
                    />
                     {(compExist) ? <Typography variant="p" sx={{color: 'red'}}>company already exist!</Typography>: <></>}

                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Update Company
                    </Button>
                    
                </Box>
            </Box>
        </Modal>
        </div>
    )
}