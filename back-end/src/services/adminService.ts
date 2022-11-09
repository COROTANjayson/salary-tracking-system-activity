import { selectDB } from "../lib/database/database";
import { constants } from '../utils/constants';
import { Response } from "../response/response";
import { DataQuery } from "../modules/databaseQuery";
import { Account } from "../modules/account";
import _ from 'lodash'

export const addAdmin = async(adminRequest:{ id: string, accountId: string, firstName: string, lastName:string, email: string, password: string, role:string} ) => {
    const response = new Response()
    const listing = await selectDB(constants.table.Account)
        const admin = _.find(listing, {'email': adminRequest.email}) as object
        
        if(admin !== undefined) {
            const result = {message: 'Email already exist'}
            return response.errorResponse(409, result )
        } else {
            
            const account = new Account(
                {
                    id: adminRequest.accountId,
                    firstName: adminRequest.firstName,
                    lastName: adminRequest.lastName,
                    email:adminRequest.email,
                    password:adminRequest.password,
                    role:adminRequest.role
                }
            )
            const accountQuery = new DataQuery(account.getTable(), account.data)
            await accountQuery.insert()
            const result = {message: 'Successfully added Admin Account'}
            return response.successResponse(201,result )
        }
    } 
export const getAdmin = async(adminParam:any) => {
    const response = new Response()
    if(_.isEmpty(adminParam)){
        const adminList = await selectDB(constants.table.Account, `role='admin'`)
        return response.successResponse(200,adminList )
    } else {
        const admin = await selectDB(constants.table.Account, `id='${adminParam.id}'`)
        if(!_.isEmpty(admin)){
            return response.successResponse(200,{admin} )
        } else {
            const result = {message: 'Employee does exist'}
            return response.errorResponse(404, result )
        }
    }
    
}
