import React, {useState} from "react";
import {
    Button,
    Modal,
    TextField,
    Typography,
    Box,
  } from '@mui/material';
import _ from 'lodash'
import { useDispatch } from 'react-redux';

import { updateProfile } from "../../pages/api/profile";
import  { setCounter } from '../../store/reducers/employee';
import { Edit } from '@mui/icons-material';




export const UpdateProfileModal = (props) => {
    const dispatch = useDispatch();
   
    const {profile} = props
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const profileData = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            password: data.get('password'),
        }
        const accountStatus = 0
        await updateProfile(profile.id, profileData).then(res => {
            accountStatus = res.request.status
            result = res.data
        }).catch((res) => {
          console.log(res.response)
        })
      
        if(accountStatus === 200) {
            dispatch(setCounter())
            setOpen(false)
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
        borderRadius: 4,
        p: 4,
      };
   
    return(
        <div>
            {/* <Button sx={{mt:2}} variant='contained' >Update Profile</Button> */}

            <Button sx={{mt:2}} variant='contained' onClick={handleOpen} startIcon={ <Edit/>}>
                Update Profile
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} textAlign= 'center'> 
            <Typography variant="h5" component="span" >
                Update Profile
            </Typography>
                <Box 
                component="form" onSubmit={handleSubmit} 
                sx={{ mt: 1 }}
                >
                    <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="firstName" 
                    label="First Name" 
                    name="firstName"
                    defaultValue={profile.firstName}
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="lastName" 
                    label="Last Name" 
                    name="lastName"
                    defaultValue={profile.lastName}
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth 
                    id="password" 
                    label="Password" 
                    name="password"
                    defaultValue={profile.password}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Update Profile
                    </Button>
                    
                </Box>
            </Box>
        </Modal>
        </div>
    )
}