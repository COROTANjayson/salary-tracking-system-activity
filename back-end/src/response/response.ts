import { IncomingMessage,  ServerResponse } from "http";

interface result{
    code: number
    result: object
}


export class Response {

    constructor() { }

    successResponse ( code: number, result: object ): result {
        const resultObj: result = {
            code,
            result
        }
        return resultObj
    }

    errorResponse (code: number, result: object ): result{
        const resultObj: result = {
            code,
            result
        }
        return resultObj
    }

}