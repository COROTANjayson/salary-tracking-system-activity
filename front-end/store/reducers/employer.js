import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import {intervalToDuration} from "date-fns";
import company from "./company";

const employers = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('employers')): null
const data = employers !== null||undefined ? employers : []
const initialState = {
    counter: 0,
    employerList: data,
    data: {
        accountID: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        accociatedCompany: '',
       
    },
}

export const employerStore = createSlice({
    name: 'employer',
    initialState: initialState,
    reducers: {
        setCounter: (state) => {
            state.counter+=1
        },
        setEmployee: (state, action) => {
        const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
       
          
        },
        addEmployer: (state, action) => {
            const data = action.payload
            state.data.accountID = data.accountID
            state.data.firstName = data.firstName
            state.data.lastName = data.lastName
            state.data.email = data.email
            state.data.password = data.password
            state.data.accociatedCompany = data.accociatedCompany
            const employerList = JSON.parse(localStorage.getItem('employers') || '[]' )
            if(employerList.length==0){
                state.employerList.push(state.data)
                localStorage.setItem('employers', JSON.stringify(state.employerList))
            } else {
                
                    const empData = _.find(employerList, {'accountID': data.accountID})
                    if(!empData){
                        state.employerList = [...employerList, state.data]
                        localStorage.setItem('employers', JSON.stringify(state.employerList))
            }
            }
        },
         updateEmployer: (state, action) => {
            const {accountID, data} = action.payload
            const employerList = JSON.parse(localStorage.getItem('employers') || '[]' )
            const result = employerList.map((value, i) => {
                if(accountID === value.accountID){

                    if(data.firstName){
                        value.firstName = data.firstName
                    }
                    if(data.lastName){
                        value.lastName = data.lastName
                    }
                    if(data.email){
                        value.email = data.email
                    }
                    if(data.password){
                         value.password = data.password
                    }
                    if(data.accociatedCompany){
                        value.accociatedCompany = data.accociatedCompany
                    }
                    
                }
                return value
            })
            state.employerList = [...result]
           
            // Perform localStorage action
            localStorage.setItem('employers', JSON.stringify(state.employerList))
            
        },
        removeEmployer: (state, action) => {
            const {accountID, companyID} = action.payload

            if(accountID){
                const result = _.filter(state.employerList, v => v.accountID !== accountID);
                state.employerList = [...result]
            }
            if(companyID){
                const result = _.filter(state.employerList, v => v.accociatedCompany !== companyID);
                state.employerList = [...result]
            }
            
            localStorage.setItem('employers', JSON.stringify(state.employerList))
        },
       
      
    }
})

export const {
    setCounter,
    setEmployee,
    addEmployer,
    updateEmployer,
    removeEmployer
} = employerStore.actions;

export const getEmployers = (state) => state.employer.employerList

export default employerStore.reducer