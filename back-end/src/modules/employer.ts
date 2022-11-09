import {v4 as uuidv4} from 'uuid'
import { Company } from './company';
import { insertDB, selectDB, updateDB2 } from "../lib/database/database";
import { constants } from '../utils/constants';

interface companyInput {
    id?: string
    name?: string
    allowableLeaves: number
    allowableOvertime: number
  }
interface employerInput {
    id?: string
    accountId?: string;
    companyId: string;
  }

export class Employer extends Company{
    employerData: employerInput = {
        accountId: '',
        companyId: '',
    }
    company: companyInput = {
        allowableOvertime: 0,
        allowableLeaves: 0
      };
    private readonly __EMPLOYERTABLE__ = constants.table.Employer

    id: string = uuidv4()
    constructor(
        params: string | employerInput,
        company: companyInput = {
            allowableOvertime: 0,
            allowableLeaves: 0
          },
        ) {
            super(company);
            if (typeof params === 'string') {
                this.id = params
              } else {
                if(params.id === undefined){
                  params.id = this.id
                } else {
                  this.id = params.id
                }
                this.employerData = {...this.employerData, ...params}
              }
            // this.employerId = (employerId === undefined)? uuidv4() : employerId
            // this.accountId = accountId
            // this.companyId= companyId;
        }
        public async getData():Promise<object[]>{
            try {
                const result = await selectDB(this.__EMPLOYERTABLE__, `id = '${this.id}'`)
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
            return this.__EMPLOYERTABLE__
        }
    // public async insert(){
    //     const stringFormat =  "{ 'id': ?, 'accountId': ?, 'companyId': ?}"
    //         const params = [
    //         {S: this.employerId},
    //         {S: this.accountId},
    //         {S: this.companyId},

            
    //         ]
    //         try {
    //         await insertDB(this.__EMPLOYERTABLE__, stringFormat, params)
    //         } catch (err){
    //         console.error(err)
    //         throw new Error("Unable to save");
    //         }
    //     }
    //     public async update(){
    //         const stringFormat =  `companyId='${this.companyId}'`
            
    //         const params = {
    //             Statement:`UPDATE ${this.__EMPLOYERTABLE__} SET ${stringFormat} where id=? and accountId=?`,
    //             Parameters: [{ S: this.employerId }, { S: this.accountId }],
    //             };
    
    //             // console.log(params)
    //             try {
    //                 await updateDB2(params)
    //             } catch (err){
    //                 console.error(err)
    //                 throw new Error("Unable to save");
    //             }
    //         }
}