import {v4 as uuidv4} from 'uuid'
import { insertDB, selectDB, updateDB2 } from '../lib/database/database';
import { constants } from '../utils/constants';

interface leaveInput {
    id?: string
    name?: string
    allowableLeaves: number
    allowableOvertime: number
  }
export class Leave {
    employeeId: string;
    leaveId: string;
    dateStarted: string;
    dateEnded: string;
    reason: string;
    approved: boolean;
    // private readonly __TABLE__ = 'Leave'
    private readonly __TABLE__ = constants.table.Leave

    constructor(
        employeeId: string,
        dateStarted: string,
        dateEnded: string,
        reason: string,
        approved: boolean,
        leaveId?: string,
        ) {
            this.employeeId = employeeId
            this.dateStarted = dateStarted
            this.dateEnded = dateEnded
            this.reason= reason;
            this.approved =approved;
            this.leaveId = (leaveId === undefined)? uuidv4() : leaveId
            
        }
        public async getData():Promise<object[]>{
            try {
                const result = await selectDB(this.__TABLE__, `id = '${this.leaveId}'`)
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
    public async insert(){
        const stringFormat =  "{ 'id': ?, 'employeeId': ?, 'dateStarted': ?, 'dateEnded': ?, 'reason': ?, 'approved': ? }"
            const params = [
            this.leaveId,
            this.employeeId,
            this.dateStarted,
            this.dateEnded,
            this.reason,
            this.approved,
            
            ]
            try {
            await insertDB(this.__TABLE__, stringFormat, params)
            } catch (err){
            console.error(err)
            throw new Error("Unable to save");
            }
        }
    public async update(){
        const stringFormat =  `approved=${this.approved}`
        
        const params = {
            Statement:`UPDATE ${this.__TABLE__} SET ${stringFormat} where id=?`,
            Parameters: [{ S: this.leaveId}],
            };

            try {
                await updateDB2(params)
            } catch (err){
                console.error(err)
                throw new Error("Unable to save");
            }
        }
}