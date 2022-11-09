import { IncomingMessage, ServerResponse } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../utils/generateParams";
import _ from 'lodash'

import { Response } from "../response/response";
import { setCalculationModel } from "../services/employeeService";
import { 
    queryEmployee,
 } from "../lib/query/employeeDb";
import { addEmployee, updateEmployee, getEmployee, deleteEmployee } from '../services/employeeService'
import { deleteProfile} from '../services/profileService'

import { decrypt } from "./middleware/jwt";

export const employeeRequest = async (req: IncomingMessage) => {
    const employeeParam = getPathParams(req.url as string, '/employee/:id')
    const response = new Response()
    switch (req.method) {
        case 'POST':
            try {
                const requestData = await getJSONDataFromRequestStream(req) as string
                const employeeRequest = await decrypt(requestData) as {data:{id: string, salaryPerHR: number, accountId: string, companyId: string, employeeType: 'full-time'| 'part-time', firstName: string, lastName:string, email: string, password: string, role:string}}
                
                const res = await addEmployee(employeeRequest.data)
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
                const employeeParam = getPathParams(req.url as string, '/employee/:id')
                const requestData = await getJSONDataFromRequestStream(req) as string
                const employeeRequest = await decrypt(requestData) as {data:{salaryPerHR: number, companyId: string, employeeType: 'full-time'| 'part-time'}}
                
                const res = await updateEmployee(employeeParam.id, employeeRequest.data)
                return res
            } catch (error) {
                console.log(error)
                let message = ''
                if (error instanceof Error) message = error.message
                const result = {message: message}
                return response.errorResponse(500, result )
            }
        case 'GET':
            const employeeParam = getPathParams(req.url as string, '/employee/:id')

            try {
                const res = await getEmployee(employeeParam)
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
                const employeeParam = getPathParams(req.url as string, '/employee/:id/:accountId')
                const employeeRes = await deleteEmployee(employeeParam.id)
                const accountRes= await deleteProfile(employeeParam.accountId)
                if(employeeRes.code === 200 && accountRes.code === 200){
                    return employeeRes
                } else {
                    return employeeRes
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


export const employeeLeavesRemainingRequest = async (req: IncomingMessage) => {
    const employeeParam= getPathParams(req.url as string, '/employee/total-leaves-remaining/:id')
    const response = new Response()
    switch (req.method) {
        case 'GET':
            try {  
                if(!_.isEmpty(employeeParam)){
                    const employee = await queryEmployee(employeeParam.id)
                    if(employee !==undefined){
                        // console.log('hello')
                        const employeeModel = await setCalculationModel(employeeParam.id, employee)
                        const remainingLeaves = employeeModel.generateRemainingLeaves()

                        const result = {result: remainingLeaves}
                        return response.successResponse(200,result )
                    }
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
export const employeeTotalAbsencesRequest = async (req: IncomingMessage) => {
    const employeeParam= getPathParams(req.url as string, '/employee/total-absences/:id')
    const response = new Response()
    switch (req.method) {
        case 'GET':
            try {  
                if(!_.isEmpty(employeeParam)){
                    const employee = await queryEmployee(employeeParam.id)
                    if(employee !==undefined){
                        const employeeModel = await setCalculationModel(employeeParam.id, employee)
                        const totalAbsences = employeeModel.generateTotalAbsences()
                        const result = {result: totalAbsences}
                        return response.successResponse(200,result )
                    }
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
export const employeeTotalOvertimeRequest = async (req: IncomingMessage) => {
    const response = new Response()
    const employeeParam= getPathParams(req.url as string, '/employee/total-overtime/:id')
    switch (req.method) {
        case 'GET':
            try {  
                if(!_.isEmpty(employeeParam)){
                    const employee = await queryEmployee(employeeParam.id)
                    if(employee !==undefined){
                        const employeeModel = await setCalculationModel(employeeParam.id, employee)
                        const totalOvertime = employeeModel.generateTotalOvertime()

                        const result = {result: totalOvertime}
                        return response.successResponse(200,result )
                    }
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
export const employeeDailyWageRequest = async (req: IncomingMessage) => {
    const response = new Response()
    const employeeParam= getPathParams(req.url as string, '/employee/daily-wage/:id')
    switch (req.method) {
        case 'GET':
            try {  
                if(!_.isEmpty(employeeParam)){
                    const employee = await queryEmployee(employeeParam.id)
                    if(employee !==undefined){
                        const employeeModel = await setCalculationModel(employeeParam.id, employee)
                        const totalDailyWage = employeeModel.generateTotalDailyWage()

                        const result = {result: totalDailyWage}
                        return response.successResponse(200,result )
                    }
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
export const employeeMonthlySalaryRequest = async (req: IncomingMessage) => {
    const response = new Response()
    const employeeParam= getPathParams(req.url as string, '/employee/monthly-salary/:id')
    switch (req.method) {
        case 'GET':
            try {  
                if(!_.isEmpty(employeeParam)){
                    const employee = await queryEmployee(employeeParam.id)
                    if(employee !==undefined){
                        const employeeModel = await setCalculationModel(employeeParam.id, employee)
                        
                        const monthlySalary = employeeModel.generateMonthlySalary()

                        const result = {result: monthlySalary}
                        return response.successResponse(200,result )
                    }
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