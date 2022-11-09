import { IncomingMessage,  ServerResponse } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../utils/generateParams";
import _ from 'lodash'

import { selectDB } from '../lib/database/database';
import { Response } from "../response/response";
import { constants } from '../utils/constants';
import { decrypt } from "./middleware/jwt";

import { addCompany, updateCompany, getCompany, deleteCompany } from '../services/companyService'
interface result{
    code: number
    result: object
}

export const companyRequest = async (req: IncomingMessage)=> {
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string

                const companyRequest = await decrypt(requestData) as {data:{name: string, allowableLeaves: number, allowableOvertime: number }}
                
                const {name} = companyRequest.data
                //find data
                const listing = await selectDB(constants.table.Company)
                const company = _.find(listing, {'name': name}) as object
                const res = await addCompany(companyRequest.data)
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
                const companyParam = getPathParams(req.url as string, '/company/:id')
                const requestData = await getJSONDataFromRequestStream(req) as string

                const companyRequest = await decrypt(requestData) as {data:{allowableLeaves: number, allowableOvertime: number }}
                
                const res = await updateCompany(companyParam.id, companyRequest.data)
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
                const companyParam = getPathParams(req.url as string, '/company/:id')
                const res = await getCompany(companyParam)
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
                const companyParam = getPathParams(req.url as string, '/company/:id')
                const res = await deleteCompany(companyParam.id)
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