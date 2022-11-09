import { selectDB } from "../lib/database/database";
import { constants } from '../utils/constants';
import { Response } from "../response/response";
import { DataQuery } from "../modules/databaseQuery";
import { Account } from "../modules/account";
import _ from 'lodash'

export const updateProfile = async(accountId:string, profileRequest: {firstName: string, lastName:string, password: string}) => {
    const response = new Response()

    const account = await selectDB(constants.table.Account, `id='${accountId}'`) as object

    if(_.isEmpty(account)){
        const result = {message: 'Id does not exist'}
        return response.errorResponse(404, result )
        
    } else {
        const accountModel = new Account(accountId)
        const conditionAttribute= await accountModel.getData()
        const dataQuery = new DataQuery(accountModel.getTable(), profileRequest, conditionAttribute)
        dataQuery.update()
        const result = {message: 'Successfully updated employee'}
        return response.successResponse(200,result )
    }
}
export const getProfile = async(accountParam:any) => {
    const response = new Response()
    if(_.isEmpty(accountParam)){
        const accountList = await selectDB(constants.table.Account)
        return response.successResponse(200,accountList)
    } else {

        const account = await selectDB(constants.table.Account, `id='${accountParam.id}'`)

        if(!_.isEmpty(account)){
            return response.successResponse(200,account[0] )
        } else {
            const result = {message: 'Account does not exist'}
            return response.errorResponse(404, result )
        }
    }
}
export const deleteProfile = async(accountId:string) => {
    const response = new Response()

    const account = await selectDB(constants.table.Account, `id='${accountId}'`)
 
    if(!_.isEmpty(account)){
        const accountModel = new Account(accountId)
        const conditionalAttribute= await accountModel.getData()
        const dataQuery = new DataQuery(accountModel.getTable(), accountModel.data, conditionalAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted account'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Company does not exist'}
        return response.errorResponse(409, result )
    }
}