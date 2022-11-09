import { IncomingMessage, ServerResponse } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../utils/generateParams";
import _ from 'lodash'

import { Response } from "../response/response";
import { addOvertime, updateOvertime, getOvertime, deleteOvertime } from '../services/overtimeService'
import { decrypt } from "./middleware/jwt";


export const employeeOvertimeRequest = async (req: IncomingMessage) => {
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const employeeParam= getPathParams(req.url as string, '/employee/overtime/:id')
                const requestData = await getJSONDataFromRequestStream(req) as string
                const overtimeRequest = await decrypt(requestData) as {data:{id: string, date: string, timeStarted: string, timeEnded: string, reason: string, approved: boolean}}
                
                const res = await addOvertime(employeeParam.id, overtimeRequest.data)
                return res
                
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            }
        case'PUT':
            try {
                const overtimeParam = getPathParams(req.url as string, '/employee/overtime/:id')
                const requestData = await getJSONDataFromRequestStream(req) as string
                const overtimeRequest = await decrypt(requestData) as {data:{date: string, timeStarted: string, timeEnded: string, reason: string, approved: boolean}}
                const res = await updateOvertime(overtimeParam.id, overtimeRequest.data)
                return res
                
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            }
        case 'GET':
            const employeeParam = getPathParams(req.url as string, '/employee/overtime/:id')
            try {
               const res = await getOvertime(employeeParam)
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
                const overtimeParam = getPathParams(req.url as string, '/employee/overtime/:id')
                console.log(overtimeParam)
                const res = await deleteOvertime(overtimeParam.id)
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