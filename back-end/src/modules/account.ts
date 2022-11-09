import { insertDB, selectDB, updateDB2 } from '../lib/database/database';
import {v4 as uuidv4} from 'uuid'
import { constants } from '../utils/constants';

interface accountInput {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    password: string;
    role: string;
  }
export class Account {
    data: accountInput = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
      };
    id: string = uuidv4()
    private readonly __TABLE__ = constants.table.Account

    constructor(
    
        params: string | accountInput
        ) {
            if (typeof params === 'string') {
                this.id = params
              } else {
                if(params.id === undefined){
                  params.id = this.id
                } else {
                  this.id = params.id
                }
                
                this.data = {...this.data, ...params}
              }
      
        }
    public async getData():Promise<object[]>{
            try {
                const result = await selectDB(this.__TABLE__, `id = '${this.id}'`)
                if (result.length === 0) {throw new Error("Not found")}
                else {
                const condtionAttribute:Array<object> = [{id: result[0].id}, {email: result[0].email}] 
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