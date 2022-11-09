import { createServer, IncomingMessage, ServerResponse } from "http";
import { companyRequest } from "./api/company";
import { adminRequest } from "./api/admin";
import { employerRequest } from "./api/employer";
import { employeeLeaveRequest } from "./api/leave"
import { employeeOvertimeRequest } from "./api/overtime"
import { employeeAbsenceRequest } from "./api/absence"

import { employeeRequest, 
    employeeLeavesRemainingRequest,
    employeeTotalAbsencesRequest,
    employeeTotalOvertimeRequest,
    employeeDailyWageRequest,
    employeeMonthlySalaryRequest

} from "./api/employee";
import { profileRequest } from "./api/profile";
import { loginRequest } from "./api/middleware/login";
import { userAuth } from "./api/middleware/authMiddleware";
import { Response } from "./response/response";
const listener = async(req: IncomingMessage, res: ServerResponse) => {
    interface result{
        code: number
        result: object
    }
    const response = new Response()
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        "Content-Type": "application/json"
    }
    try {
        const validateUser = await userAuth(req.headers.authorization as string)

        let result: undefined|result
        if(req.method === "OPTIONS") {
            res.writeHead(204, headers);
            res.end();
            return;
        }
        if ((req.url as string).match('/login(.*?)')) {
            result = await loginRequest(req) as result | undefined
        }
        if ((req.url as string).match('/company(.*?)')) {
            if(validateUser === false){
                result = response.errorResponse(200, {message:'Invalid Token'})
            } else {    
                result = await companyRequest(req) as result | undefined
            }
            
        }
        if ((req.url as string).match('/admin(.*?)')) {
            if(validateUser === false){
                result = response.errorResponse(200, {message:'Invalid Token'})
            } else { 
                result = await adminRequest(req) as result | undefined
            }
        }
        if ((req.url as string).match('/employer(.*?)')) {
            console.log(req.headers)
            if(validateUser === false){
                result = response.errorResponse(200, {message:'Invalid Token'})
            } else { 
                result = await employerRequest(req) as result | undefined
            }
        }
        if ((req.url as string).match('/employee(.*?)')) {
            if((req.url as string).match('/employee/leave(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeLeaveRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/overtime(.*?)')) {
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeOvertimeRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/absence(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeAbsenceRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/total-leaves-remaining(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeLeavesRemainingRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/total-absences(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeTotalAbsencesRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/total-overtime(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeTotalOvertimeRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/daily-wage(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeDailyWageRequest(req) as result | undefined
                }
            } else if((req.url as string).match('/employee/monthly-salary(.*?)')){
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeMonthlySalaryRequest(req) as result | undefined
                }
            }else {
                if(validateUser === false){
                    result = response.errorResponse(200, {message:'Invalid Token'})
                } else { 
                    result = await employeeRequest(req) as result | undefined
                }
            }
           
        }
        if ((req.url as string).match('/profile(.*?)')) {
            const validateUser = await userAuth(req.headers.authorization as string)
            if(validateUser === false){
                result = response.errorResponse(200, {message:'Invalid Token'})
            } else {
                result = await profileRequest(req) as result | undefined
            }
            
        }
        if(result !== undefined){
            res.writeHead(result.code, headers);
            res.end(JSON.stringify(result.result));
        } else {
            throw new Error('Bad Request')
        }
        
    } catch (error) {
        let message = ''
        if (error instanceof Error) message = error.message
        res.writeHead(400, headers);
        res.end(JSON.stringify(message));
    }
}

const server = createServer(listener)
server.listen(8080)