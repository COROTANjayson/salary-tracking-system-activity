import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../utils/generateParams";
import _ from 'lodash'

import { Response } from "../response/response";
import { addAdmin, getAdmin } from '../services/adminService'

export const adminRequest = async (req: IncomingMessage) => {
    const employerParam = getPathParams(req.url as string, '/admin/:id/')
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const employerRequest = await getJSONDataFromRequestStream(req) as { id: string, accountId:string, firstName: string, lastName:string, email: string, password: string, role:string}
                const res = await addAdmin(employerRequest)
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
                const res = await getAdmin(employerParam)
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