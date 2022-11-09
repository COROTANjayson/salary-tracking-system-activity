import _ from 'lodash'
import { Leave } from "../modules/leaves";
import { DataQuery } from "../modules/databaseQuery";
import { selectDB } from '../lib/database/database';
import company from "__data__/company";
import { Response } from "../response/response";
import { constants } from '../utils/constants';

export const addLeave = async(employeeId: string, leaveRequest:{id: string, dateStarted: string, dateEnded: string, reason: string, approved: boolean}) => {
    const response = new Response()
    const employee = await selectDB(constants.table.Employee, `id='${employeeId}'`) as object

    if(_.isEmpty(employee)){
        const result = {message: 'Account does not exist'}
        return response.errorResponse(404, result )
    } else {
        const leaveModel = new Leave(
            employeeId,
            leaveRequest.dateStarted,
            leaveRequest.dateEnded,
            leaveRequest.reason,
            leaveRequest.approved,
            leaveRequest.id
        ) 
        await leaveModel.insert()
        const result = {message: 'Successfully added request leave'}
        return response.successResponse(201,result )
    }
}

export const updateLeave = async(leaveId: string, leaveRequest:{dateStarted: string, dateEnded: string, reason: string, approved: boolean})=> {
    const response = new Response()
    const leave = await selectDB(constants.table.Leave, `id='${leaveId}'`) as object

    if(_.isEmpty(leave)){
        const result = {message: 'Leave id does exist'}
        return response.errorResponse(404, result )
    } else {
        const leaveModel = new Leave(
            '',
            leaveRequest.dateStarted,
            leaveRequest.dateEnded,
            leaveRequest.reason,
            leaveRequest.approved,
            leaveId
        ) 
        await leaveModel.update()
        const result = {message: 'Successfully updated request leave'}
        return response.successResponse(200,result )
    }
}

export const getLeave = async(employeeParam:any)=> {
    const response = new Response()
    if(_.isEmpty(employeeParam)){
        const leaveList = await selectDB(constants.table.Leave)
        return response.successResponse(200,{leaveList} )
        
    } else {
        const leaveList = await selectDB(constants.table.Leave, `employeeId='${employeeParam.id}'`)
            return response.successResponse(200,leaveList )
    
    }
}

export const deleteLeave = async(leaveId: string)=> {
    const response = new Response()
    
    const leave = await selectDB(constants.table.Leave, `id='${leaveId}'`)
    if(!_.isEmpty(leave)){
        const condtionAttribute:Array<object> = [{id: leaveId}, {employeeId: leave[0].employeeId}] 
        const dataQuery = new DataQuery(constants.table.Leave, {}, condtionAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted leave'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Leave id does not exist'}
        return response.errorResponse(409, result )
    }
}


