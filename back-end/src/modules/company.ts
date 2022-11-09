import {v4 as uuidv4} from 'uuid'
import { values, keys, map} from 'lodash'
import { insertDB, selectDB, updateDB, updateDB2 } from "../lib/database/database";
import { constants } from '../utils/constants';
interface companyInput {
    id?: string
    name?: string
    allowableLeaves: number
    allowableOvertime: number
  }
export class Company {

    data: companyInput = {
        allowableOvertime: 0,
        allowableLeaves: 0
      };
    id: string = uuidv4()
    private readonly __TABLE__ = constants.table.Company
    constructor(
        params: string | companyInput
        ) {
            if (typeof params === 'string') {
                this.id = params
              } else {
                if(params.id === undefined){
                  params.id = this.id
                }
                this.data = {...this.data, ...params}
              }
            
        }
    public async getData():Promise<object[]>{
        try {
            const result = await selectDB(this.__TABLE__, `id = '${this.id}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
            const condtionAttribute:Array<object> = [{id: result[0].id}, {name: result[0].name}] 
            console.log('this', condtionAttribute)
            return condtionAttribute
            }
        } catch (err){
            console.error(err)
            throw new Error("Unable to update");
        }
    }
    public getTable(): string{
      return this.__TABLE__
  }
}