import {
  Button,
  AppBar,
  Toolbar,
 Link,
  } from '@mui/material';

import { useRouter } from 'next/router';
export default function RootLayout({children}) {
    const router = useRouter()
    const loggedOut= () => {
        localStorage.removeItem('token')
        router.push('/login')
    }
 
    return (
        <div>
            <AppBar  position="static">
                <Toolbar>
                <Button size="large"
                    edge="start"
                    color="inherit" sx={{color: "white", }} onClick={()=> router.push('/dashboard')} variant="text">Dashboard</Button>

                <Link href="/profile" sx={{ flexGrow: 1}}>
                    <Button sx={{color: "white" }} variant="text">Profile</Button>
                </Link>
                <Button variant="contained"  onClick={loggedOut}>Logout</Button>
                </Toolbar>
            </AppBar>
            {children}
        </div>
    )
}