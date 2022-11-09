import {v4 as uuidv4} from 'uuid'
import { values, keys, map} from 'lodash'
import { insertDB, selectDB, updateDB, updateDB2, deleteDB } from "../lib/database/database";

export class DataQuery {
  
    __TABLE__:string
    data: object;
    conditionAttribute?: Array<object>;
    id?: string;
    constructor(
   
        __TABLE__: string,
        data: object,
        conditionAttribute?: Array<object>,
        id?: string
        ) {
            this.data = data
            this.__TABLE__ = __TABLE__
            this.conditionAttribute = conditionAttribute
            this.id = id
        }

    public async insert(){
        
        let insertFormat = JSON.parse(JSON.stringify(this.data))
        insertFormat= {...insertFormat}
        const fields = keys(insertFormat)
        const newValues = values(insertFormat)
        const inserStatement = map(fields, (field) => `'${field}': ? `)

        try {
            await insertDB(this.__TABLE__, `{${inserStatement.join()}}`, newValues)
        } catch (err){
            console.error(err)
            throw new Error("Unable to save");
            }
        }
     public async update() {
            const updateFormat = JSON.parse(JSON.stringify(this.data))
        
            const fields = keys(updateFormat)
            const newValues = values(updateFormat)
            const updateStatement = map(fields, (field) => `${field} = ? `)
            
            const where =  map(this.conditionAttribute, (value, index) => 
                (index === 0)?`${keys(value)[0]} = '${values(value)[0]}' AND` : `${keys(value)[0]} = '${values(value)[0]}' `
            )
       
            try {
              await updateDB(this.__TABLE__,updateStatement.join(), newValues, where.join(' ') )
            } catch (err){
              console.error(err)
              throw new Error("Unable to update");
            }
          }
        public async delete() {
            const updateFormat = JSON.parse(JSON.stringify(this.data))
        
            const fields = keys(updateFormat)
            
            const where =  map(this.conditionAttribute, (value, index) => 
                (index === 0)?`${keys(value)[0]} = '${values(value)[0]}' AND` : `${keys(value)[0]} = '${values(value)[0]}' `
            )
         
            try {
              await deleteDB(this.__TABLE__, where.join(' ') )
            } catch (err){
              console.error(err)
              throw new Error("Unable to update");
            }
          }
        
   
   
}

