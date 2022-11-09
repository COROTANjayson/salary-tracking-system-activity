import { IncomingMessage, ServerResponse } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../utils/generateParams";
import _ from 'lodash'

import { Response } from "../response/response";

import { addEmployer, updateEmployer, getEmployer, deleteEmployer } from '../services/employerService'
import { deleteProfile } from '../services/profileService'

import { decrypt } from "./middleware/jwt";

export const employerRequest = async (req: IncomingMessage) => {
    const employerParam = getPathParams(req.url as string, '/employer/:id/:accountId')
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string
                
                const employerRequest = await decrypt(requestData) as {data:{ id: string, accountId:string, firstName: string, lastName:string, email: string, password: string, role:string, companyId: string}}
                
                const res = await addEmployer(employerRequest.data)
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
                const requestData = await getJSONDataFromRequestStream(req) as string
                
                const employerRequest = await decrypt(requestData) as {data:{ companyId: string}}
                

                const res = await updateEmployer(employerParam.id,employerRequest.data)
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
                const res = await getEmployer(employerParam)
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
                const employerParam = getPathParams(req.url as string, '/employer/:id/:accountId')
                const employerRes = await deleteEmployer(employerParam.id)
                const accountRes= await deleteProfile(employerParam.accountId)
                if(employerRes.code === 200 && accountRes.code === 200){
                    return employerRes
                } else {
                    return employerRes
                }
                
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            } 
           
    }
}