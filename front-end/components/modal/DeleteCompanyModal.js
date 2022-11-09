
import _ from "lodash";
import {
    Container,
    Button,
    Box,
    Typography,
    Modal,
    } from '@mui/material';

import {  Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import React, {useState} from "react";
import  {
    setCounter 
} from '../../store/reducers/company';
import { deleteCompany} from "../../pages/api/company";


export const DeleteCompanyModal = (props) => {
    const dispatch = useDispatch();
    const counter = useSelector(state => state.company.counter)
    const {companyID} = props
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    
    const handleSubmit = async() => {
        // dispatch(setCounter())
        await deleteCompany(companyID).then(res =>{
            console.log(res.request.status)
            if(res.request.status){
                dispatch(setCounter())
            }
        })

        
        setOpen(false)
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      };
   
    return(
        <div>
            <Button onClick={handleOpen} >
                <Delete sx={{color:'red'}}></Delete>
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} textAlign= 'center'> 
            <Typography variant="h5" component="div" sx={{color: 'red'}}>
                Warning!
            </Typography>
            <Typography variant="h6" component="div" >
                All account associated with this company will be removed.
            </Typography>
            <Typography variant="p" component="div" >
                Do you still want to removed the company?
            </Typography>
            <Container sx={{display: 'flex', justifyContent: 'space-between'}}>
            
            <Button onClick={handleSubmit } sx={{m:2}} className="button" variant="contained">Yes</Button>
            
            <Button onClick={handleClose} sx={{backgroundColor: 'red', m:2}} className="button" variant="contained">No</Button>
            </Container>
                
            </Box>
        </Modal>
        </div>
    )
}