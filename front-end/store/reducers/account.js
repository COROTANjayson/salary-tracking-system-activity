import { createSlice } from "@reduxjs/toolkit";




const accountList = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('accountList')): null
const data = accountList !== null||undefined ? accountList : []

const initialState = {
    accountList:[ {
        accountID: 'admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        type: 'admin',
    }, ...data],
    data: {
        accountID: '',
        email: '',
        password: '',
        type: '',
        accociatedCompany: ''
    },
}

export const accountStore = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        setAccount: (state, action) => {
            state.data = action.payload
        },
        addAccount: (state, action) => {
            const data = action.payload
            state.data.accountID = data.accountID
            state.data.email = data.email
            state.data.password = data.password
            state.data.type = data.type
            state.data.accociatedCompany = data.accociatedCompany
            const accountList = JSON.parse(localStorage.getItem('accountList') || '[]' )
            
            if(accountList.length==0){
                state.accountList.push(state.data)
                localStorage.setItem('accountList', JSON.stringify(state.accountList))

            } else {
                const empData = _.find(accountList, {'accountID': data.accountID})
                if(!empData){
                    state.accountList = [...accountList, state.data]
                    localStorage.setItem('accountList', JSON.stringify(state.accountList))
                    
            }
            }
        },
        updateAccount: (state, action) => {
            const {accountID, data} = action.payload
            const accountList = JSON.parse(localStorage.getItem('accountList') || '[]' )
            const result = accountList.map((value, i) => {
                if(accountID === value.accountID){
                    if(data.email){
                        value.email = data.email
                    }
                    if(data.password){
                        value.password = data.password
                    }
                }
                return value
            })
            state.accountList = [...result]
            localStorage.setItem('accountList', JSON.stringify(state.accountList))
            
        },
        removeAccount: (state, action) => {
            const {accountID, companyID} = action.payload
            if(accountID){
                const result = _.filter(state.accountList, v => v.accountID !== accountID);
                state.accountList = [...result]
            }
            if(companyID){
                const result = _.filter(state.accountList, v => v.accociatedCompany !== companyID);
                state.accountList = [...result]
            }
            localStorage.setItem('accountList', JSON.stringify(state.accountList))
        },
        
    }
})

export const {setAccount, addAccount, removeAccount, updateAccount} = accountStore.actions

export default accountStore.reducer