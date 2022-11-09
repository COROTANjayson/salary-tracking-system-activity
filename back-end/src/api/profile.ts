import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../utils/generateParams";
import _ from 'lodash'
import { Response } from "../response/response";
import { updateProfile, getProfile } from '../services/profileService'
import {  decrypt } from "./middleware/jwt";

export const profileRequest = async (req: IncomingMessage) => {
    const accountParam = getPathParams(req.url as string, '/profile/:id')
    const response = new Response()
    switch (req.method) {
        case'PUT':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string
                const accountRequest = await decrypt(requestData) as {data:{firstName: string, lastName:string, password: string}}
                const res = await updateProfile(accountParam.id, accountRequest.data)
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
               const res = await getProfile(accountParam)
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