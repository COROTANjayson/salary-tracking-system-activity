import { v4 as uuidv4 } from 'uuid';
import {intervalToDuration} from "date-fns";
import _ from 'lodash'
import { Leave } from "./leaves";
import { Absence } from "./absences";
import { Overtime } from "./overtime";
import { Company } from './company';
import {  selectDB} from "../lib/database/database";
import { constants } from '../utils/constants';

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
export class Employee extends Company{
 
    employeeData: employeeInput = {
        salaryPerHR: 0,
        accountId: '',
        companyId: '',
        employeeType: 'full-time'
    }
    company: companyInput = {
        allowableOvertime: 0,
        allowableLeaves: 0
      };
    leaves?: Array<Leave> ;
    absences?: Array<Absence>;
    overtime?: Array<Overtime>;
    id: string = uuidv4()
    private readonly __EMPLOYEETABLE__ = constants.table.Employee

    constructor(
      
        params: string | employeeInput,
        company: companyInput = {
            allowableOvertime: 0,
            allowableLeaves: 0
          },
        leaves: Array<Leave> =[],
        absences: Array<Absence>=[],
        overtime: Array<Overtime>=[],
        ) {
            super( company );
       
            if (typeof params === 'string') {
                this.id = params
              } else {
                if(params.id === undefined){
                  params.id = this.id
                }
                this.employeeData = {...this.employeeData, ...params}
              }
            this.company = company
            this.leaves = leaves
            this.absences = absences
            this.overtime = overtime
            
        }
    public async getData():Promise<object[]>{
        try {
            const result = await selectDB(this.__EMPLOYEETABLE__, `id = '${this.id}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
            const condtionAttribute:Array<object> = [{id: result[0].id}, {accountId: result[0].accountId}] 
            console.log('this', condtionAttribute)
            return condtionAttribute
            }
        } catch (err){
            console.error(err)
            throw new Error("Unable to update");
        }
    }
    public getTable(): string{
        return this.__EMPLOYEETABLE__
    }
   
    private countTotalLeaves(): number{
      const currentDate = new Date();
      let totalLeaves = 0
      console.log('hello',this.leaves)
      if(!_.isEmpty(this.leaves)){
          const currentMonthLeaves = _.filter(this.leaves, value => new Date(value.dateStarted).getMonth() === currentDate.getMonth())
          currentMonthLeaves.map(value =>{

              const interval=  intervalToDuration({
                  start: new Date(value.dateStarted),
                  end: new Date(value.dateEnded)
                })
                if(interval.days !== undefined){
                  const initialAbsences = interval.days+1 
                totalLeaves += initialAbsences
                }
                
          })
        
      }
          return totalLeaves
      }
    generateRemainingLeaves():number{
        let remainingLeaves = 0
        const totalLeaves = this.countTotalLeaves()
        console.log("HIIIII",this.company.allowableLeaves, '-', totalLeaves)
        remainingLeaves =  this.company.allowableLeaves - totalLeaves
        if(remainingLeaves < 0 ){
            remainingLeaves = 0
            }
       
        return  remainingLeaves
    }
    generateTotalAbsences():number{
        const currentDate = new Date();
        
        let excessLeaves = 0
        const totalLeaves = this.countTotalLeaves()
        if(totalLeaves > this.company.allowableLeaves){
            excessLeaves = totalLeaves - this.company.allowableLeaves
        }

        let totalAbsences = 0

        if(!_.isEmpty(this.absences)){
            const currentMonthAbsences = _.filter(this.absences, value => new Date(value.dateStarted).getMonth() === currentDate.getMonth())
            currentMonthAbsences.map(value => {
                const interval=  intervalToDuration({
                    start: new Date(value.dateStarted),
                    end: new Date(value.dateEnded)
                  })
                  if(interval.days !== undefined){
                    const initialLeaves = interval.days+1 
                  totalAbsences += initialLeaves
                  }
            });

            if(excessLeaves>0){
                totalAbsences += excessLeaves
            }

            return totalAbsences
        }

        const ttlAbsences = 0
        return  ttlAbsences
    }
    generateTotalOvertime():number{
        const currentDate = new Date();

        let totalHours = 0
        let initialHours = 0
        let totalMinutes = 0
        if(!_.isEmpty(this.overtime)){
            const currentMonthAbsences = _.filter(this.overtime, value => new Date(value.date).getMonth() === currentDate.getMonth())
            currentMonthAbsences.map(value => {
                const interval=  intervalToDuration({
                    start: new Date(value.timeStarted),
                    end: new Date(value.timeEnded)
                  })
                  if(interval.hours !== undefined){
                    initialHours += interval.hours 
                  }
                  if(interval.minutes !== undefined){
                    totalMinutes += interval.minutes 
                  }
            });

            const minToHours = intervalToDuration({
                start: 0,
                end: new Date(totalMinutes* 60000)
            })
            if(minToHours.hours!== undefined){
                totalHours = initialHours+minToHours.hours

            }
            if(this.company.allowableOvertime<totalHours){
                totalHours = this.company.allowableOvertime
            }

        }
        return  totalHours
    }
    generateTotalDailyWage():number{
       let dailyWage = 0

       if(this.employeeData.employeeType ==="part-time"){
        dailyWage = this.employeeData.salaryPerHR * 4
       }
       if(this.employeeData.employeeType === "full-time"){
        dailyWage = this.employeeData.salaryPerHR * 8
       }
        return  dailyWage
    }
    generateMonthlySalary( ):number{
        const ttlAbsences = this.generateTotalAbsences()
        const ttlLeaves = this.countTotalLeaves()
        const leavesRemaining = this.generateRemainingLeaves()
        const ttlOvertime = this.generateTotalOvertime()
        const dailyWage = this.generateTotalDailyWage()

        const totalWage = dailyWage * 20;
        const overtimePay = ttlOvertime * (this.employeeData.salaryPerHR* 0.2) 
        const leavesRemainingBonus = leavesRemaining * dailyWage
        const deduction = ttlAbsences * dailyWage
        
        const monthlySalary = totalWage + overtimePay + leavesRemainingBonus - deduction
        return  monthlySalary
    }
    
    
}