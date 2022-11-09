import _ from 'lodash'
import { Overtime } from "../modules/overtime";
import { DataQuery } from "../modules/databaseQuery";
import { selectDB } from '../lib/database/database';
import { Response } from "../response/response";
import { constants } from '../utils/constants';

export const addOvertime = async(employeeId: string, overtimeRequest:{id: string, date: string, timeStarted: string, timeEnded: string, reason: string, approved: boolean}) => {
    const response = new Response()
    const employee = await selectDB(constants.table.Employee, `id='${employeeId}'`) as object
    if(_.isEmpty(employee)){
        const result = {message: 'Account does not exist'}
        return response.errorResponse(404, result )
    } else {
        const overtimeModel = new Overtime(
            employeeId,
            overtimeRequest.date,
            overtimeRequest.timeStarted,
            overtimeRequest.timeEnded,
            overtimeRequest.approved,
            overtimeRequest.reason,
            overtimeRequest.id
        ) 
        await overtimeModel.insert()
        const result = {message: 'Successfully added request overtime'}
        return response.successResponse(201,result )
    }
}

export const updateOvertime = async(overtimeId: string, overtimeRequest:{date: string, timeStarted: string, timeEnded: string, reason: string, approved: boolean})=> {
    const response = new Response()
    const overtime = await selectDB(constants.table.Overtime, `id='${overtimeId}'`) as object

    if(_.isEmpty(overtime)){
        const result = {message: 'Overtime id does not exist'}
        return response.errorResponse(404, result )
    } else {
        const overtimeModel = new Overtime(
            '',
            overtimeRequest.date,
            overtimeRequest.timeStarted,
            overtimeRequest.timeEnded,
            overtimeRequest.approved,
            overtimeRequest.reason,
            overtimeId
        ) 
        await overtimeModel.update()
        const result = {message: 'Successfully updated request leave'}
        return response.successResponse(200,result )
    }
}

export const getOvertime = async(employeeParam:any)=> {
    const response = new Response()
    if(_.isEmpty(employeeParam)){
        const accountList = await selectDB(constants.table.Overtime)
        return response.successResponse(200,accountList )
        
    } else {
        const overtimeList = await selectDB(constants.table.Overtime, `employeeId='${employeeParam.id}'`)
            return response.successResponse(200,overtimeList )
 
    }
}

export const deleteOvertime = async(overtimeId: string)=> {
    const response = new Response()
    
    const overtime = await selectDB(constants.table.Overtime, `id='${overtimeId}'`)
    if(!_.isEmpty(overtime)){
        const condtionAttribute:Array<object> = [{id: overtimeId}, {employeeId: overtime[0].employeeId}] 
        const dataQuery = new DataQuery(constants.table.Overtime, {}, condtionAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted overtime'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Overtime id does not exist'}
        return response.errorResponse(409, result )
    }
}


