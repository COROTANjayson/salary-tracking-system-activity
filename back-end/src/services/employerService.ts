import { selectDB } from "../lib/database/database";
import { constants } from '../utils/constants';
import { Response } from "../response/response";
import { DataQuery } from "../modules/databaseQuery";
import { Account } from "../modules/account";
import _ from 'lodash'

import { 
    queryEmployer,
    queryAllEmployer
 } from "../lib/query/employerDb";
 import { Employer } from "../modules/employer";
export const addEmployer = async(employerRequest:{ id: string, accountId: string, firstName: string, lastName:string, email: string, password: string, role:string, companyId: string} ) => {
    const response = new Response()
    const listing = await selectDB(constants.table.Account)
        const employer = _.find(listing, {'email': employerRequest.email}) as object
        const company = await selectDB(constants.table.Company, `id='${employerRequest.companyId}'`) as object
        
        if(employer !== undefined) {
            const result = {message: 'Email already exist'}
            return response.errorResponse(409, result )
        } else if(_.isEmpty(company)) {
            const result = {message: 'Company id does not exist'}
            return response.errorResponse(404, result )
        } else {
            
            const account = new Account(
                {
                    id: employerRequest.accountId,
                    firstName: employerRequest.firstName,
                    lastName: employerRequest.lastName,
                    email:employerRequest.email,
                    password:employerRequest.password,
                    role:employerRequest.role
                }
            )
            const employer = new Employer(
                {
                    id: employerRequest.id,
                    accountId: account.id, 
                    companyId: employerRequest.companyId, 
                }
            )
            const accountQuery = new DataQuery(account.getTable(), account.data)
            await accountQuery.insert()
            const employeeQuery = new DataQuery(employer.getTable(), employer.employerData)
            await employeeQuery.insert()
            const result = {message: 'Successfully added employee'}
            return response.successResponse(201,result )
        }
    } 

export const updateEmployer = async(employerId:string, employerRequest:{companyId: string}) => {
    const response = new Response()

    const employer = await selectDB(constants.table.Employer, `id='${employerId}'`) as object
                
    const company = await selectDB(constants.table.Company, `id='${employerRequest.companyId}'`) as object
    if(_.isEmpty(employer)){
        const result = {message: 'Id does not exist'}
        return response.errorResponse(404, result )
    } else if(_.isEmpty(company)){
        const result = {message: 'Company does not exist'}
        return response.errorResponse(404, result )
    } else {
        const employer = new Employer( employerId)
        const conditionAttribute= await employer.getData()
        const dataQuery = new DataQuery(employer.getTable(), employerRequest, conditionAttribute)
        await dataQuery.update()
        const result = {message: 'Successfully Updated Employer'}
        return response.successResponse(200,result)
    }
}
export const getEmployer = async(employerParam:any) => {
    const response = new Response()
    if(_.isEmpty(employerParam)){
        const employerList = await queryAllEmployer()
        return response.successResponse(200,employerList )
        
    } else {
        const employer = await queryEmployer(employerParam.id)
        if(!_.isEmpty(employer)){
            return response.successResponse(200,employer )
        } else {
            const result = {message: 'Employee does exist'}
            return response.errorResponse(404, result )
        }
    }
    
}
export const deleteEmployer = async(employerId:string) => {
    const response = new Response()

    const employee = await selectDB(constants.table.Employer, `id='${employerId}'`)
    console.log('hello',employee)
    if(!_.isEmpty(employee)){
        const emplyerModel = new Employer(employerId)
        const conditionalAttribute= await emplyerModel.getData()
        const dataQuery = new DataQuery(emplyerModel.getTable(), emplyerModel.data, conditionalAttribute)
        await dataQuery.delete()
        console.log('delete')
        const result = {message: 'Successfully deleted Employer'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Eployer Id does not Exist'}
        return response.errorResponse(404, result )
    }
}
