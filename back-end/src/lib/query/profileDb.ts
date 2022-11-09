import { selectDB } from "../database/database"

import _ from "lodash";
import { constants } from '../../utils/constants';

export const queryProfile = async(accountId: string) => {
   
    const employerList = await selectDB(constants.table.Employer)
    let employer = _.find(employerList, {'accountId': accountId})
    if(employer !== undefined){
        
        const company = await selectDB(constants.table.Company, `id='${employer.companyId}'`)
        const account = await selectDB(constants.table.Account, `id='${employer.accountId}'`)
       
        if(!_.isEmpty(company) && !_.isEmpty(account)){
            const companyData = company[0]
            const accountData = account[0]
            employer.name = companyData.name
            employer.firstName = accountData.firstName
            employer.lastName = accountData.lastName
            employer.email = accountData.email
            employer.password = accountData.password
        } else {
            employer = {}
        }
    }
    return employer

}
export const queryAllEmployer = async() => {
   
    const employerDB = await selectDB(constants.table.Employer)
    const companyDB = await selectDB(constants.table.Company)
    const accountDB = await selectDB(constants.table.Account)
    const employerList = _.map(employerDB, (employer)=> {
        const company = _.find(companyDB, {id: employer.companyId})
        const account = _.find(accountDB, {id: employer.accountId})
      

        if(!_.isEmpty(company) && !_.isEmpty(account)){
            employer.name = company.name
            employer.firstName = account.firstName
            employer.lastName = account.lastName
            employer.email = account.email
            employer.password = account.password
            return employer
        } else {
            return employer = {}
        }
    })
  
    return employerList

}