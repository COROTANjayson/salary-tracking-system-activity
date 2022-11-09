import { IncomingMessage, request } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../../utils/generateParams";
import jose from 'jose'
import { constants } from '../../utils/constants';
import { Response } from "../../response/response";
import { selectDB } from "../../lib/database/database";
import { generateToken, decrypt } from "./jwt";
import _ from 'lodash'
export const loginRequest = async (req: IncomingMessage) => {
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const loginRequest = await getJSONDataFromRequestStream(req) as string
                
                const requestData = await decrypt(loginRequest) as {data:{email: string, password: string }}
                // console.log(requestData)
                const { email, password} = requestData.data
                if(email === ''|| password === ''){
                    const result = {message: 'Email and password does not match'}
                    return response.errorResponse(400, result )
                }
                
                const account = await selectDB(constants.table.Account, `email='${email}' AND password='${password}'`)
                
                if(_.isEmpty(account)){
                    const result = {message: 'Email and password does not match'}
                    return response.errorResponse(400, result )
                } else{
                    const payload = {
                        firstName: account[0].firstName,
                        lastName: account[0].lastName,
                        id: account[0].id,
                        role: account[0].role
                    }
                    console.log(payload)
                    const token = await generateToken(payload)
                    return response.errorResponse(200, {token: token} )
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