import { createSlice } from "@reduxjs/toolkit";

const data = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('login')) : null
// const data = login !== undefined ? login : []
// console.log(data)
let credentials = {
    accountID: '',
    email: '',
    password: '',
    type: '',
    isLoggedIn: false
}

    if(data !== null){
        credentials = {
            accountID: data.accountID,
            email: data.email,
            password: data.password,
            type: data.type,
            isLoggedIn: true
        }
    }

const initialState = {
    loginCred: credentials,
}

export const loginStore = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        loginAccount: (state, action) => {
            const data = action.payload
            
            state.loginCred.accountID = data.accountID
            state.loginCred.email = data.email
            state.loginCred.password = data.password
            state.loginCred.type = data.type
            state.loginCred.isLoggedIn = true
            // const login = JSON.parse(localStorage.getItem('login') || '[]' )
            
            localStorage.setItem('login', JSON.stringify(state.loginCred))
        },
        logoutAccount: (state) => {
            const accountID = action.payload

            state.loginCred.accountID = ""
            state.loginCred.email = ""
            state.loginCred.password = "" 
            state.loginCred.type = ""
            state.loginCred.type = false

            console.log('hello')
            localStorage.removeItem('login')
      
        },
        
    }
})

export const {loginAccount,logoutAccount } = loginStore.actions

export default loginStore.reducer