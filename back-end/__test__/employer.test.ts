
import data from '../__data__/employer'
import { Employer } from "../src/modules/employer";

import _ from 'lodash'
import { addEmployer, updateEmployer, getEmployer, deleteEmployer } from '../src/services/employerService'
import { addCompany, updateCompany, getCompany, deleteCompany } from '../src/services/companyService'
import {  deleteProfile } from '../src/services/profileService'

// import {  deleteCompany } from '../src/services/companyService'

interface employerInput {
        id: string;
        accountId: string;
        companyId: string;
        name: string;
        allowableLeaves: number;
        allowableOvertime:number
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: string;
    
  }

const employerId = '1e2m3p4l5o6y7e8r'
const accountId = '1a2c3c4o5u6n7t8'
const companyId = '1c2o3m4p5a6n7y890'
// const companyId2 = 'company12234567890'


test('add employer', async() => {
    const companyData = {id: companyId ,name: 'JJC', allowableLeaves: 2, allowableOvertime: 4}
    
    await addCompany(companyData)
    

    const  employeeData = {
        id: employerId,
        accountId: accountId,
        companyId: companyId,
        firstName: 'Jean',
        lastName: 'Gunnhidlr',
        email: 'employer@gmail.com',
        password: '12345678',
        role: 'employer',
    }
    const res = await addEmployer(employeeData)
    // console.log(res)
    expect(res.code).toBe(201)
})

test('update employer', async() => {
    const  employeeData = {
        companyId: companyId,
    }
    const res = await updateEmployer(employerId, employeeData)
    expect(res.code).toBe(200)
    // console.log(res)

})


test('Get Employer', async() => {
    const employerParam = {id: employerId}
    const res = await getEmployer(employerParam)
    const result = res.result as employerInput
    expect(res.code).toBe(200)

    expect(result.companyId).toBe(companyId)
    expect(result.name).toBe('JJC')
    // expect(result.allowableLeaves).toBe(5)
    // expect(result.allowableOvertime).toBe(6)
    expect(result.email).toBe('employer@gmail.com')
    expect(result.password).toBe('12345678')
    // expect(result.role).toBe('employer')


})

test('Delete Employer', async() => {
    const res = await deleteEmployer(employerId)
    const account = await deleteProfile(accountId)
    const company = await deleteCompany(companyId)
    
    

    expect(res.code).toBe(200)
    

})
