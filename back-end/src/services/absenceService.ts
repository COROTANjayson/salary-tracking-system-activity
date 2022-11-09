import _ from 'lodash'
import { Absence } from "../modules/absences";
import { DataQuery } from "../modules/databaseQuery";
import { selectDB } from '../lib/database/database';
import { Response } from "../response/response";
import { constants } from '../utils/constants';

export const addAbsence  = async(employeeId: string, absenceRquest:{id: string, dateStarted: string, dateEnded: string}) => {
    const response = new Response()
   
    const employee = await selectDB(constants.table.Employee, `id='${employeeId}'`) as object

    if(_.isEmpty(employee)){
        const result = {message: 'Account does exist'}
        return response.errorResponse(404, result )
    } else {
        const absence = new Absence(
            employeeId,
            absenceRquest.dateStarted,
            absenceRquest.dateEnded,
            absenceRquest.id
        ) 
        await absence.insert()
        const result = {message: 'Successfully added absence'}
        return response.successResponse(201,result )
    }
}


export const getAbsence  = async(employeeParam:any)=> {
    const response = new Response()
     try {
        if(_.isEmpty(employeeParam)){
            const absenceList = await selectDB(constants.table.Absence)
            return response.successResponse(200,absenceList )
            
        } else {
            const absenceList = await selectDB(constants.table.Absence, `employeeId='${employeeParam.id}'`)
                return response.successResponse(200,absenceList)
        
        } 
     } catch (error) {
        console.log(error)
        let message = ''
        if (error instanceof Error) message = error.message
        const result = {message: message}
        return response.errorResponse(500, result )
    }
}

export const deleteAbsence = async(absenceId: string)=> {
    const response = new Response()
    console.log('id',absenceId)
    const absence = await selectDB(constants.table.Absence, `id='${absenceId}'`)
    console.log('absence',absence)
    if(!_.isEmpty(absence)){
        const condtionAttribute:Array<object> = [{id: absenceId}, {employeeId: absence[0].employeeId}] 
        const dataQuery = new DataQuery(constants.table.Absence, {}, condtionAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted absence'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Absence id does not exist'}
        return response.errorResponse(404, result )
    }
}


