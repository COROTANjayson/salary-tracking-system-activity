import { selectDB } from "../lib/database/database";
import { constants } from '../utils/constants';
import { Response } from "../response/response";
import { DataQuery } from "../modules/databaseQuery";
import { Account } from "../modules/account";
import _ from 'lodash'

import { 
    queryEmployee,
    queryAllEmployee,
    queryLeaves,
    queryAbsences,
    queryOvertime
 } from "../lib/query/employeeDb";
 import { Employee } from "../modules/employee";
export const addEmployee = async(employeeRequest:{id: string, salaryPerHR: number, accountId: string, companyId: string, employeeType: 'full-time'| 'part-time', firstName: string, lastName:string, email: string, password: string, role:string} ) => {
    const response = new Response()
    
    const employeeList = await selectDB(constants.table.Account)
    const email = _.find(employeeList, {'email': employeeRequest.email}) as object

    const company = await selectDB(constants.table.Company, `id='${employeeRequest.companyId}'`) as object
    if(!_.isEmpty(email)){
        const result = {message: 'Email already exist'}
        return response.errorResponse(409, result )
        
    } else if(_.isEmpty(company)){
        const result = {message: 'Company id does not exist'}
        return response.errorResponse(404, result )
        
    } else {
        const accountData = {
            id: employeeRequest.accountId,
            firstName: employeeRequest.firstName,
            lastName: employeeRequest.lastName,
            email:employeeRequest.email,
            password:employeeRequest.password,
            role:employeeRequest.role
        }
        const account = new Account(accountData )
        const employeeData = {
            id: employeeRequest.id,
            salaryPerHR: employeeRequest.salaryPerHR, 
            accountId: account.id, 
            companyId: employeeRequest.companyId, 
            employeeType: employeeRequest.employeeType,
        }
        const employee = new Employee(employeeData  )
        const accountQuery = new DataQuery(account.getTable(), account.data)
        await accountQuery.insert()
        const employeeQuery = new DataQuery(employee.getTable(), employee.employeeData)
        await employeeQuery.insert()
        // await account.insert()
        // await employee.insert()
        const result = {message: 'Successfully added new employee'}
        return response.successResponse(201,result )
    } 
}
export const updateEmployee = async(employeeId:string, employeeRequest:{salaryPerHR: number, companyId: string, employeeType: 'full-time'| 'part-time'}) => {
    const response = new Response()

    const employee = await selectDB(constants.table.Employee, `id='${employeeId}'`) as object

    const company = await selectDB(constants.table.Company, `id='${employeeRequest.companyId}'`) as object

    if(_.isEmpty(employee)){
        const result = {message: 'Id does not exist'}
        return response.errorResponse(409, result )
        
    } else if(_.isEmpty(company)){
        const result = {message: 'Company id does not exist'}
        return response.errorResponse(404, result )
        
    } else {
        const updateModel = new Employee(employeeId)
        const conditionAttribute= await updateModel.getData()
        const dataQuery = new DataQuery(updateModel.getTable(), employeeRequest, conditionAttribute)
        await dataQuery.update()
        const result = {message: 'Successfully updated employee'}
        return response.successResponse(200,result )
    }
}
export const getEmployee = async(employeeParam:any) => {
    const response = new Response()
    if(_.isEmpty(employeeParam)){
        // const employeeList = await selectDB(constants.table.Employee)
        const employeeList = await queryAllEmployee()
        return response.successResponse(200,employeeList)
    } else {
        const employee = await queryEmployee(employeeParam.id)
        const employeesByCompany = await queryAllEmployee(employeeParam.id)
        if(!_.isEmpty(employee) || employee !== undefined){
            return response.successResponse(200,employee )
        } else if(!_.isEmpty(employeesByCompany)) {
            return response.successResponse(200,employeesByCompany )
        } else{
            const result = {message: 'Employee does not exist'}
            return response.errorResponse(404, result )
        }
    }
    }
export const deleteEmployee = async(employeeId:string) => {
    const response = new Response()

    const employee = await selectDB(constants.table.Employee, `id='${employeeId}'`)
 
    if(!_.isEmpty(employee)){
        const emplyeeModel = new Employee(employeeId)
        const conditionalAttribute= await emplyeeModel.getData()
        // emplyeeModel.data = { ...companyRequest }
        const dataQuery = new DataQuery(emplyeeModel.getTable(), emplyeeModel.data, conditionalAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted Employee'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Employee does not exist'}
        return response.errorResponse(409, result )
    }
}
export const setCalculationModel = async(employeeId:string, employee: any ): Promise<Employee> => {
   console.log('employeeID',employeeId)
    const leaves= await queryLeaves(employeeId)
    const absences= await queryAbsences(employeeId)
    const overtime=  await queryOvertime(employeeId)
    const employeeData = {
        salaryPerHR: employee.salaryPerHR, 
        accountId: employee.id, 
        companyId: employee.companyId, 
        employeeType: employee.employeeType,
    }
    const company = {
        allowableOvertime: employee.allowableOvertime,
        allowableLeaves: employee.allowableLeaves
      };
    const employeeModel = new Employee(
        employeeData,
        company,
        leaves,
        absences, 
        overtime,
    )
    return employeeModel
}