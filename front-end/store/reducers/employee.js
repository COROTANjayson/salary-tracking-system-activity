import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import {intervalToDuration} from "date-fns";

const employeeList = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('employeeList')): null
const data = employeeList !== null||undefined ? employeeList : []
const initialState = {
    counter: 0,
    employeeList: data,
    absence: {
        reason: '',
        dateStarted: '',
        dateEnded: '',
    },
    leaves: {
        reason: '',
        dateStarted: '',
        dateEnded: '',
    },
    overtime: {
        dateTimeStarted: '',
        dateTimeEnded: '',
    },
    data: {
        employmentType: '',
        accountID: '',
        firstName: '',
        lastName: '',
        email: '',
        accociatedCompany: '',
        salaryPerHR: '',
        absence: [],
        leaves: [],
        overtime: [],
        requestLeave: [],
        requestOvertime: []
    },
    leavesRemaining: 0,
    totalAbsences: 0,
    totalLeaves:0,
    totalOvertime: 0,
    dailyWage: 0,
    totalSalary: 0
}

export const employeeStore = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setCounter: (state) => {
            state.counter+=1
        },
        setEmployee: (state, action) => {
        const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
        state.employeeList = [...employeeList]
        },
        addEmployee: (state, action) => {
            const data = action.payload
            state.data.employmentType =data.employmentType
            state.data.accountID = data.accountID
            state.data.firstName = data.firstName
            state.data.lastName = data.lastName
            state.data.email = data.email
            state.data.password = data.password
            state.data.accociatedCompany = data.accociatedCompany
            state.data.salaryPerHR = data.salaryPerHR
            const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
            if(employeeList.length==0){
                state.employeeList.push(state.data)
                localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
            } else {
                    const empData = _.find(employeeList, {'accountID': data.accountID})
                    if(!empData){
                        state.employeeList = [...employeeList, state.data]
                        localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
            }
            }
        },
         updateEmployee: (state, action) => {
            const {accountID, data} = action.payload
            const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
                const result = employeeList.map((value, i) => {
                    if(accountID === value.accountID){
                        if(data.firstName){
                            if(data.employmentType){
                                value.employmentType =data.employmentType
                            }
                            if(data.firstName){
                                value.firstName = data.firstName
                            }
                            if(data.lastName){
                                value.lastName = data.lastName
                            }
                            if(data.email){
                                value.email = data.email
                            }
                            if(data.accociatedCompany){
                                value.accociatedCompany = data.accociatedCompany
                            }
                            if(data.salaryPerHR){
                                value.salaryPerHR = data.salaryPerHR
                            }
                        }
                        if(data.dateStarted){
                            const date = _.find(value.absence, {'dateStarted': data.dateStarted})
                            if(!date){
                                value.absence.push(data)
                            }
                        }
                        if(data.dateStartedLeaves){
                            const date = _.find(value.leaves, {'dateStartedLeaves': data.dateStartedLeaves})
                            
                            if(!date){
                                value.leaves.push(data)
                            }
                        }
                        if(data.dateTimeStarted){
                            const date = _.find(value.overtime, {'dateTimeStarted': data.dateTimeStarted})
                            
                            if(!date){
                                value.overtime.push(data)
                            }
                        }
                    }
                    return value
                })
            
            state.employeeList = [...result]
           
            // Perform localStorage action
            localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
            
        },
        addRequest:(state, action) => {
            const {accountID, data} = action.payload
            const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )

            const result = employeeList.map((value, i) => {
                if(accountID === value.accountID){
                    if(data.dateStartedLeaves){
                        const date = _.find(value.requestLeave, {'dateStartedLeaves': data.dateStartedLeaves})
                        if(!date){
                            value.requestLeave.push(data)
                        }
                    }
                    if(data.dateTimeStarted){
                        const date = _.find(value.requestOvertime, {'dateTimeStarted': data.dateTimeStarted})
                        
                        if(!date){
                            value.requestOvertime.push(data)
                        }
                    }
                }
                
                return value
            })
        
        state.employeeList = [...result]
       
        // Perform localStorage action
        localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
        },
        removeEmployee: (state, action) => {
            const {accountID, companyID} = action.payload
            if(accountID){
                const result = _.filter(state.employeeList, v => v.accountID !== accountID);
                state.employeeList = [...result]
            }
            if(companyID){
                const result = _.filter(state.employeeList, v => v.accociatedCompany!== companyID);
                state.employeeList = [...result]
            }
            
            localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
        },
        removeDate: (state, action) => {
            const {accountID, checkDate, index}= action.payload
            const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )


            const employeeData = _.find(employeeList, {'accountID': accountID});
         
            const result = employeeList.map((val, i) => {
                if(val.accountID === accountID){
                    if(checkDate === 'leave'){
                        const result = _.filter(val.leaves, (v, i) => i !== index);
                        val.leaves = [...result]
                    }
                    if(checkDate === 'absent'){
                        const result = _.filter(val.absence, (v, i) => i !== index);
                        val.absence = [...result]
                    }
                    if(checkDate === 'overtime'){
                        const result = _.filter(val.overtime, (v, i) => i !== index);
                        val.overtime = [...result]
                    }
                    if(checkDate === 'requestLeave'){
                        const result = _.filter(val.requestLeave, (v, i) => i !== index);
                        val.requestLeave = [...result]
                    }
                    if(checkDate === 'requestOvertime'){
                        const result = _.filter(val.requestOvertime, (v, i) => i !== index);
                        val.requestOvertime = [...result]
                    }
                }

                return val
            })
            
            state.employeeList = [...result]
            localStorage.setItem('employeeList', JSON.stringify(state.employeeList))
        },
       
        computeLeavesRemaining: (state, action) => {
            const d = new Date();
            const {accountID, companyLeaves} = action.payload
            const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
            const data = _.find(employeeList, {'accountID': accountID})
            let remainingLeaves = 0
            let totalLeaves = 0
            if(data) {
                data.leaves.map(value => {
                    const parsedate = new Date(value.dateStartedLeaves)
                    if(parsedate.getMonth() == d.getMonth() ){
                        // get interval duration between dates
                        const interval=  intervalToDuration({
                        start: parseDate(value.dateStartedLeaves),
                        end: parseDate(value.dateEndedLeaves)
                      })
                      const initialLeaves = interval.days+1
                        totalLeaves += initialLeaves
                    }
                });
                remainingLeaves =  leavesRemaining(companyLeaves, totalLeaves)
            }
            
            state.totalLeaves = totalLeaves
            state.leavesRemaining = remainingLeaves
        },
        computeTotalAbsences: (state, action) => {
            const d = new Date();
            const {accountID, companyLeaves} = action.payload
             // find account id
             const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
            const data = _.find(employeeList, {'accountID': accountID, })
            
             let excessLeaves = 0
            if(state.totalLeaves > companyLeaves){
                excessLeaves =  state.totalLeaves - companyLeaves
            }
            

            let totalAbsences = 0
            if(data) {
                data.absence.map(value => {
                    const parsedate = new Date(value.dateStarted)
                    if(parsedate.getMonth() == d.getMonth() ){
                        // get interval duration between dates
                        const interval=  intervalToDuration({
                        start: parseDate(value.dateStarted),
                        end: parseDate(value.dateEnded)
                      })
                      const initialAbsences = interval.days+1
                        totalAbsences += initialAbsences
                    }
                });

                if(excessLeaves>0){
                    totalAbsences += excessLeaves
                }
            }
            state.totalAbsences = totalAbsences
        },
        totalHoursOvertime: (state, action) => {
            const {accountID, overtimeLimit} = action.payload
            const currentDate = new Date()
             const employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]' )
            const data = _.find(employeeList, {'accountID': accountID, })
           
            let initialHours = 0
            let totalMinutes = 0

            if(data){
                data.overtime.forEach(value => {
                    const parsedate = parseDateTime(value.dateTimeStarted )
                    
                    if(parsedate.getMonth() == currentDate.getMonth() ){
                        const interval=  intervalToDuration({
                            start: parseDateTime(value.dateTimeStarted),
                            end: parseDateTime(value.dateTimeEnded)
                        })
                       
                        initialHours+= interval.hours
                        totalMinutes+= interval.minutes
                    }
                });
            }

            const minToHours = intervalToDuration({
                start: 0,
                end: new Date(totalMinutes* 60000)
            })
            let totalHours=initialHours+minToHours.hours
            let totalOvertime = {
                hours: totalHours,
                minutes: 0
            }
            if(overtimeLimit<totalOvertime.hours){
                totalOvertime.hours = overtimeLimit
                totalOvertime.minutes = 0
            }
            
            state.totalOvertime = totalOvertime.hours
        },
        computeDailyWage: (state, action) => {
            const {accountID} = action.payload
             // find account id
            const data = _.find(state.employeeList, {'accountID': accountID, })
            let dailyWage = 0
            // check if employee is partime/fulltime
            if(data){
                if(data.employmentType == "part-time"){
                dailyWage = data.salaryPerHR * 4
                }
                if(data.employmentType == "full-time"){
                    dailyWage = data.salaryPerHR * 8
                }
            }
            // return dailyWage
            state.dailyWage = dailyWage 
        },
        computeMonthlySalary: (state, action) => {
            const {
                accountID,

            } = action.payload
            const data = _.find(state.employeeList, {'accountID': accountID, })
            
            if(data){
                const totalWage = state.dailyWage * 20;
                const overtimePay = state.totalOvertime * (data.salaryPerHR* 0.2) 
                const leavesRemainingBonus = state.leavesRemaining * state.dailyWage
                const deduction = state.totalAbsences * state.dailyWage
                state.totalSalary = totalWage + overtimePay + leavesRemainingBonus - deduction

            }

        }
    }
})

const leavesRemaining= (companyLeaves, empLeaves) =>{
    let remainingLeaves =  companyLeaves - empLeaves
     if(remainingLeaves < 0 ){
            remainingLeaves = 0
        }
    return remainingLeaves
}
const parseDate=(str) =>{
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

const parseDateTime=(str) =>{
    var mdyt = str.split(/[/' ':]/);
    return new Date(mdyt[2], mdyt[0]-1, mdyt[1], mdyt[3], mdyt[4]);
}

export const {
    setCounter,
    setEmployee,
    addEmployee,
    updateEmployee,
    removeEmployee,
    computeLeavesRemaining,
    computeTotalAbsences,
    totalHoursOvertime,
    computeDailyWage,
    computeMonthlySalary,
    removeDate,
    addRequest
} = employeeStore.actions;

export const getEmployees = (state) => state.employee.employeeList
export default employeeStore.reducer