import { Employee } from "../src/modules/employee";
import _ from 'lodash'
import { addEmployee, updateEmployee, getEmployee, deleteEmployee } from '../src/services/employeeService'
import { addCompany, updateCompany, getCompany, deleteCompany } from '../src/services/companyService'
import {  deleteProfile } from '../src/services/profileService'
import { addLeave, updateLeave, deleteLeave } from '../src/services/leaveService'
import { addOvertime, updateOvertime, deleteOvertime } from '../src/services/overtimeService'

import { addAbsence, deleteAbsence } from '../src/services/absenceService'

// import {  deleteCompany } from '../src/services/companyService'

interface employeeInput {
        id?: string
    salaryPerHR: number;
    accountId: string;
    companyId: string;
    employeeType: 'full-time'| 'part-time';
  }

const employeeId = '1e2m3p4l5o6y7e8e'
const accountId = '1a2c3c4o5u6n7t8'
const companyId = '1c2o3m4p5a6n7y890123'
const leaveId = '1l2e3a4v5e56'
const absenceId = '1a2b3s4e5n6c7e8'
const overtimeId = '1o2v3e4r6t7i6me'

// ------------Employe test----------------
test('add employee', async() => {
    const companyData = {id: companyId ,name: 'Hello', allowableLeaves: 2, allowableOvertime: 4}
    await addCompany(companyData)
    const  employeeData = {
        id: employeeId,
        salaryPerHR: 20,
        accountId: accountId,
        companyId: companyId,
        employeeType: "full-time" as 'full-time'| 'part-time',
        firstName: 'Ayaka',
        lastName: 'Kamisato',
        email: 'employee@gmail.com',
        password: '12345678',
        role: 'employee',
    }
    const res = await addEmployee(employeeData)
    console.log(res)
    expect(res.code).toBe(201)
})
test('update employee', async() => {
    const  employeeData = {
        salaryPerHR: 40,
        companyId: companyId,
        employeeType: "part-time" as 'full-time'| 'part-time',
    }
    const res = await updateEmployee(employeeId,employeeData)
    const result = res.result as employeeInput
    expect(res.code).toBe(200)

})
test('Get Employee', async() => {
    const employeeParam = {id: employeeId}
    const res = await getEmployee(employeeParam)
    const result = res.result as employeeInput
    expect(res.code).toBe(200)
    expect(result.id).toBe(employeeId)
    expect(result.salaryPerHR).toBe(40)
    expect(result.companyId).toBe(companyId)
    expect(result.employeeType).toBe("part-time")
})



// ------------Leave test----------------
test('Add new leave request', async() => {
    const companyData = {
        dateStarted:  '10/05/2022, 12:00:00 AM',
        dateEnded: '10/06/2022, 12:00:00 AM',
        reason:'Seminar',
        approved: false,
        id: leaveId
    }
    const res = await addLeave(employeeId, companyData)
    expect(res.code).toBe(201)
    
})

test('Update Leave', async() => {
    const companyData = {
        approved: true,
        dateStarted:  '10/05/2022, 12:00:00 AM',
        dateEnded: '10/06/2022, 12:00:00 AM',
        reason:'Seminar',}
    const res = await updateLeave(leaveId, companyData)
    expect(res.code).toBe(200)
    
})

// ------------Absence test----------------

test('Add new absence', async() => {
    const data = {
        dateStarted: '10/05/2022, 12:00:00 AM',
        dateEnded: '10/06/2022, 12:00:00 AM',
        reason:'Seminar',
        id: absenceId
    }
    const res = await addAbsence(employeeId, data)
    expect(res.code).toBe(201)
})
// ------------Overtime test----------------
test('Add new overtime request', async() => {
    const data = {
        date:  '10/07/2022, 12:00:00 AM',
        timeStarted:  '10/07/2022, 5:00:00 PM',
        timeEnded: '10/07/2022, 6:00:00 PM',
        reason:'Seminar',
        approved: false,
        id: overtimeId
    }
    const res = await addOvertime(employeeId, data)
    expect(res.code).toBe(201)
    
})

test('Update overtime', async() => {
    const data = {
        date:  '10/07/2022, 12:00:00 AM',
        timeStarted:  '10/07/2022, 5:00:00 PM',
        timeEnded: '10/07/2022, 6:00:00 PM',
        reason:'Seminar',
        approved: true
    }
    const res = await updateOvertime(overtimeId, data)
    expect(res.code).toBe(200)
    
})
test('Delete Data', async() => {
    // const leave = await deleteLeave(leaveId)
    // const absence = await deleteAbsence(absenceId)
    // const overtime = await deleteOvertime(overtimeId)
    // const account = await deleteProfile(accountId)
    // const employee = await deleteEmployee(employeeId)
    const company = await deleteCompany(companyId)
    // expect(leave.code).toBe(200)
    // expect(absence.code).toBe(200)
    // expect(overtime.code).toBe(200)
    expect(company.code).toBe(200)
    // expect(account.code).toBe(200)
    // expect(employee.code).toBe(200)

})

