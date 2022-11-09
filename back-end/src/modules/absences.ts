import {v4 as uuidv4} from 'uuid'
import { insertDB, selectDB, updateDB2 } from '../lib/database/database';
import { constants } from '../utils/constants';
export class Absence {
    employeeId: string;
    absenceId: string;
    dateStarted: string;
    dateEnded: string;
    private readonly __TABLE__ = constants.table.Absence
   
    constructor(
        employeeId: string,
        dateStarted: string,
        dateEnded: string,
        absenceId?: string,
        ) {
            this.employeeId = employeeId
            this.absenceId = (absenceId === undefined)? uuidv4() : absenceId
            this.dateStarted = dateStarted
            this.dateEnded = dateEnded
            
        }
    public async insert(){
        const stringFormat =  "{ 'id': ?, 'employeeId': ?, 'dateStarted': ?, 'dateEnded': ? }"
            const params = [
                this.absenceId,
                this.employeeId,
                this.dateStarted,
                this.dateEnded,
            ]
            try {
            await insertDB(this.__TABLE__, stringFormat, params)
            } catch (err){
            console.error(err)
            throw new Error("Unable to save");
            }
        }
}