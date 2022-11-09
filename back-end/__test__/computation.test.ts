import { Employee } from "../src/modules/employee";
import _ from 'lodash'
import data from '../__data__/employee'
import { Leave } from "src/modules/leaves";
import { Absence } from "src/modules/absences";
import { Overtime } from "src/modules/overtime";
interface companyInput {
    id?: string
    name?: string
    allowableLeaves: number
    allowableOvertime: number
  }
interface employeeInput {
    id?: string
    salaryPerHR: number;
    accountId: string;
    companyId: string;
    employeeType: 'full-time'| 'part-time';
  }
const empList = data
    const employeeModel1 = new Employee(
        {
            salaryPerHR:empList[0].salaryPerHR as number,
            accountId:empList[0].accountID as string,
            companyId: empList[0].companyID as string,
            employeeType: empList[0].employeeType as 'full-time'| 'part-time',
        },
        {
            name:  empList[0].name as string,
            allowableLeaves: empList[0].allowableLeaves as number,
            allowableOvertime: empList[0].allowableOvertime as number,
        },
        empList[0].leaves as Array<Leave>,
        empList[0].absences as Array<Absence>, 
        empList[0].overtime as Array<Overtime>,
    )
    const employeeModel2 = new Employee(
        {
            salaryPerHR:empList[1].salaryPerHR as number,
            accountId:empList[1].accountID as string,
            companyId: empList[1].companyID as string,
            employeeType: empList[1].employeeType as 'full-time'| 'part-time',
        },
        {
            name:  empList[1].name as string,
            allowableLeaves: empList[1].allowableLeaves as number,
            allowableOvertime: empList[1].allowableOvertime as number,
        },
        empList[1].leaves as Array<Leave>,
        empList[1].absences as Array<Absence>, 
        empList[1].overtime as Array<Overtime>,
    )

test('remaining leaves computation', () =>{
    expect(employeeModel1.generateRemainingLeaves()).toBe(3)
    //return 0 when remaining leaves is greater than allowable leaves
    expect(employeeModel2.generateRemainingLeaves()).toBe(0)


})    
test('total absences computation', () =>{
    expect(employeeModel1.generateTotalAbsences()).toBe(1)
    // if total leaves excess from the company allowable leaves
    expect(employeeModel2.generateTotalAbsences()).toBe(2)

})    
test('total overtime computation', () =>{
    expect(employeeModel1.generateTotalOvertime()).toBe(9)
    
    // return 20 when total overtime is greater than allowable overtime
    expect(employeeModel2.generateTotalOvertime()).toBe(20)

})    
test('daily wage computation', () =>{
    // full time example
    expect(employeeModel1.generateTotalDailyWage()).toBe(1600)
    
    // part time example
    expect(employeeModel2.generateTotalDailyWage()).toBe(800)

})  
test('monthly salary computation', () =>{
    expect(employeeModel1.generateMonthlySalary()).toBe(35560)
})


// it("should return 0 when remaining leaves is greater than allowable leaves", ()=>{
//     expect(employeeModel2.generateRemainingLeaves()).toBe(0)

// })