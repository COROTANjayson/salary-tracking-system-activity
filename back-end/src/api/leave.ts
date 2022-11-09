import { IncomingMessage, ServerResponse } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../utils/generateParams";
import _ from 'lodash'

import { Response } from "../response/response";
import { addLeave, updateLeave, getLeave, deleteLeave } from '../services/leaveService'
import { decrypt } from "./middleware/jwt";


export const employeeLeaveRequest = async (req: IncomingMessage) => {
    const employeeParam= getPathParams(req.url as string, '/employee/leave/:id')
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string
                const leaveRequest = await decrypt(requestData) as {data:{id: string,dateStarted: string, dateEnded: string, reason: string, approved: boolean}}
                
                const res = addLeave(employeeParam.id, leaveRequest.data)
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
                const leaveParam = getPathParams(req.url as string, '/employee/leave/:id')
                const requestData = await getJSONDataFromRequestStream(req) as string
                const leaveRequest = await decrypt(requestData) as {data:{dateStarted: string, dateEnded: string, reason: string, approved: boolean}}
                
                const res = updateLeave(leaveParam.id, leaveRequest.data)
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
                const res = getLeave(employeeParam)
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
                const leaveParam = getPathParams(req.url as string, '/employee/leave/:id')
                console.log(leaveParam)
                const res = await deleteLeave(leaveParam.id)
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
