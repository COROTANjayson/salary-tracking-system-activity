import { IncomingMessage} from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../utils/generateParams";
import _ from 'lodash'
import { Response } from "../response/response";
import { addAbsence,  getAbsence, deleteAbsence } from '../services/absenceService'
import { decrypt } from "./middleware/jwt";

export const employeeAbsenceRequest = async (req: IncomingMessage) => {
    const employeeId= getPathParams(req.url as string, '/employee/absence/:id')
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string
                const absenceRequest = await decrypt(requestData) as {data:{id: string, dateStarted: string, dateEnded: string}}
                
                const res = await addAbsence(employeeId.id,absenceRequest.data)
                return res
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            }
        case 'GET':
            try {
                const employeeParam = getPathParams(req.url as string, '/employee/absence/:id')
                const res = await getAbsence(employeeParam)
                return res
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            }
        case 'DELETE':
            try {
                const absenceParam = getPathParams(req.url as string, '/employee/absence/:id')
                console.log(absenceParam)
                const res = await deleteAbsence(absenceParam.id)
                return res
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            } 
    }
}