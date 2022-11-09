import {v4 as uuidv4} from 'uuid'
import { insertDB, selectDB, updateDB2 } from '../lib/database/database';
import { constants } from '../utils/constants';

export class Overtime {
    employeeId: string;
    overtimeId: string;
    date: string;
    timeStarted: string;
    timeEnded: string;
    approved: boolean;
    reason: string;
    private readonly __TABLE__ = constants.table.Overtime
    constructor(
        employeeId: string,
        date: string,
        timeStarted: string,
        timeEnded: string,
        approved: boolean,
        reason: string,
        overtimeId?: string,
        ) {
            this.employeeId = employeeId
            this.overtimeId = (overtimeId === undefined)? uuidv4() : overtimeId
            this.date = date
            this.timeStarted = timeStarted
            this.timeEnded = timeEnded
            this.approved = approved
            this.reason= reason;
            
        }
    public async insert(){
        const stringFormat =  "{ 'id': ?, 'employeeId': ?, 'date': ?, 'timeStarted': ?, 'timeEnded': ?, 'reason': ?, 'approved': ? }"
            const params = [
            this.overtimeId,
            this.employeeId,
            this.date,
            this.timeStarted,
            this.timeEnded,
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
            Parameters: [{ S: this.overtimeId}],
            };

            // console.log(params)
            try {
                await updateDB2(params)
            } catch (err){
                console.error(err)
                throw new Error("Unable to save");
            }
        }
}