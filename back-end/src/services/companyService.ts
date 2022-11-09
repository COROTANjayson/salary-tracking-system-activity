import _ from 'lodash'
import { Company } from "../modules/company";
import { DataQuery } from "../modules/databaseQuery";
import { selectDB } from '../lib/database/database';
import company from "__data__/company";
import { Response } from "../response/response";
import { constants } from '../utils/constants';
import { deleteEmployer } from './employerService'
import { deleteEmployee} from './employeeService'
import { deleteProfile } from './profileService'
import { deleteLeave } from './leaveService'
import { deleteAbsence } from './absenceService'
import { deleteOvertime } from './overtimeService'


export const addCompany = async(companyRequest:{name: string, allowableLeaves: number, allowableOvertime: number}) => {
    const response = new Response()
    //find data
    const listing = await selectDB(constants.table.Company)
    const company = _.find(listing, {'name': companyRequest.name}) as object
    
    if(company === undefined){
        const companyModel = new Company(companyRequest)
        // await model.insert()
        const dataQuery = new DataQuery(companyModel.getTable(), companyModel.data)
        await  dataQuery.insert()
        const result = {message: 'Successfully added new company'}
        return response.successResponse(201,result )
    } else {
        const result = {message: 'Company name already exist'}
        return response.errorResponse(409, result )
    }
}

export const updateCompany = async(companyId: string, companyRequest:{allowableLeaves: number, allowableOvertime: number})=> {
    const response = new Response()
    console.log('id',companyId)
    const company = await selectDB(constants.table.Company, `id='${companyId}'`)
 
    if(!_.isEmpty(company)){
        const companyModel = new Company(companyId)
        const conditionalAttribute= await companyModel.getData()
        companyModel.data = { ...companyRequest }
        const dataQuery = new DataQuery(companyModel.getTable(), companyModel.data, conditionalAttribute)
        await dataQuery.update()
        const result = {message: 'Successfully updated company'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Company does not exist'}
        return response.errorResponse(409, result )
    }
}

export const getCompany = async(companyParam:any)=> {
    const response = new Response()

    if(_.isEmpty(companyParam)){
        const companyList = await selectDB(constants.table.Company)
        return response.successResponse(200,companyList )
        
    } else {
        const company = await selectDB(constants.table.Company, `id='${companyParam.id}'`)
        if(!_.isEmpty(company)){
            return response.successResponse(200,company[0] )
        } else {
            const result = {message: 'Company does not exist'}
            return response.errorResponse(404, result )
        }
        
    }
}

export const deleteCompany = async(companyId: string)=> {
    const response = new Response()
    
    const company = await selectDB(constants.table.Company, `id='${companyId}'`)
    const employer = await selectDB(constants.table.Employer, `companyId='${companyId}'`)
    const employee = await selectDB(constants.table.Employee, `companyId='${companyId}'`)
    const leaves = await selectDB(constants.table.Leave)
    const absences = await selectDB(constants.table.Absence)
    const overtime = await selectDB(constants.table.Overtime)

    if(!_.isEmpty(company)){
        if(!_.isEmpty(employer)){
            _.map(employer, values=> {
                deleteEmployer(values.id as string)
                deleteProfile(values.accountId as string)
            })
        }
       if(!_.isEmpty(employee)){
            _.map(employee, values=> {

                const leaveList = _.filter(leaves, {employeeId: values.id})
                _.map(leaveList, values=> {
                    deleteLeave(values.id as string)
                })
                const absenceList = _.filter(absences, {employeeId: values.id})
                _.map(absenceList, values=> {
                    deleteAbsence(values.id as string)
                })
                const overtimeList = _.filter(overtime, {employeeId: values.id})
                _.map(overtimeList, values=> {
                    deleteOvertime(values.id as string)
                })

                deleteEmployee(values.id as string)
                deleteProfile(values.accountId as string)
            })
       }
       
        const companyModel = new Company(companyId)
        const conditionalAttribute= await companyModel.getData()
        const dataQuery = new DataQuery(companyModel.getTable(), companyModel.data, conditionalAttribute)
        await dataQuery.delete()
        const result = {message: 'Successfully deleted company'}
        return response.successResponse(200,result )
    } else {
        const result = {message: 'Company does not exist'}
        return response.errorResponse(404, result )
    }
}


