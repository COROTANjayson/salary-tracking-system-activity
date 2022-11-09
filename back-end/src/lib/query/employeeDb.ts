import { execute, selectDB } from "../database/database"

import _ from "lodash";
import { Leave } from "../../modules/leaves";
import { Absence } from "../../modules/absences";
import { Overtime } from "../../modules/overtime";
import { constants } from '../../utils/constants';


export const queryAllEmployee = async(companyId: string = '') => {
    let employeeDB = await selectDB(constants.table.Employee)
   
    if(companyId !== ''){
        employeeDB = await selectDB(constants.table.Employee, `companyId='${companyId}'`)
    }
    const companyDB = await selectDB(constants.table.Company)
    const accountDB = await selectDB(constants.table.Account)
    
    const employeeList = _.map(employeeDB, (employee)=> {
        const company = _.find(companyDB, {id: employee.companyId})
        const account = _.find(accountDB, {id: employee.accountId})

        if(!_.isEmpty(company) && !_.isEmpty(account)){
            employee.name = company.name
            employee.firstName = account.firstName
            employee.lastName = account.lastName
            employee.email = account.email
            employee.password = account.password
            return employee
        } else {
            return employee = {}
        }
    })
  
    return employeeList

}
export const queryEmployee = async(employeeId: string) => {
   
    const employeeList = await selectDB(constants.table.Employee)
    let employee = _.find(employeeList, {'id': employeeId})
    
    if(employee === undefined){
        employee = _.find(employeeList, {'accountId': employeeId})
    }
    if(employee !== undefined){
        const company = await selectDB(constants.table.Company, `id='${employee.companyId}'`)
        const account = await selectDB(constants.table.Account, `id='${employee.accountId}'`)
       console.log('company',company)
       console.log('account',account)
        if(!_.isEmpty(company) && !_.isEmpty(account)){
            const companyData = company[0]
            const accountData = account[0]

            employee.name= companyData.name
            employee.allowableLeaves= companyData.allowableLeaves
            employee.allowableOvertime= companyData.allowableOvertime
            employee.firstName = accountData.firstName
            employee.lastName = accountData.lastName
            employee.firstName = accountData.firstName
            employee.email = accountData.email
            employee.password = accountData.password
            employee.role = accountData.role
        } else {
            employee = {}
        }
    }
    return employee
}
export const queryLeaves = async(employeeId: string) =>{
    const leaves= await selectDB(constants.table.Leave, `employeeId='${employeeId}' AND approved=true`)
    const leaveList = _.map(leaves, value=>{
        const newLeave = new Leave(
            value.employeeId as string,
            value.dateStarted as string,
            value.dateEnded as string,
            value.reason as string,
            value.approved as boolean
        )
        return newLeave
    })
    return leaveList
}

export const queryAbsences= async(employeeId: string) =>{
    const absences= await selectDB(constants.table.Absence, `employeeId='${employeeId}'`) 
    const absenceList = _.map(absences, value=>{
        const newLeave = new Absence(
            value.employeeId as string,
            value.dateStarted as string,
            value.dateEnded as string,
        )
        return newLeave
    })
    return absenceList
}

export const queryOvertime= async(employeeId: string) =>{
    const overtime= await selectDB(constants.table.Overtime, `employeeId='${employeeId}' AND approved=true`)
    const overtimeList = _.map(overtime, value=>{
        const newOvertime = new Overtime(
            value.employeeId as string,
            value.date as string,
            value.timeStarted as string,
            value.timeEnded as string,
            value.approved as boolean,
            value.reason as string,
            
        )
        return newOvertime
    })
    return overtimeList
}