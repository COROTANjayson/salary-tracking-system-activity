import { Company } from "../src/modules/company";
import { DataQuery } from "../src/modules/databaseQuery";
import { addCompany, updateCompany, getCompany, deleteCompany } from '../src/services/companyService'

import _ from 'lodash'
import data from '../__data__/company'
interface companyInput {
    id?: string
    name?: string
    allowableLeaves: number
    allowableOvertime: number
  }
const id = 'e99eed82-9ccc-49f2-a577-391c332b7edb'
test('Add new Company', async() => {
    // const model = new Company('Workbean', 20, 3)
    // expect(model.name).toBe('Workbean');
    // expect(typeof model.companyId).toBe('string')
    // expect(model.allowableLeaves).toBe(20)
    // expect(model.allowableOvertime).toBe(3)
    const companyData = {id: id,name: 'Hello', allowableLeaves: 2, allowableOvertime: 4}
    const res = await addCompany(companyData)
    expect(res.code).toBe(201)
    
})

test('Update Company', async() => {
    const companyData = {allowableLeaves: 4, allowableOvertime: 6}
    const res = await updateCompany(id, companyData)
    expect(res.code).toBe(200)
    
})

test('Get Company', async() => {
    const companyParam = {id: id}
    const res = await getCompany(companyParam)
    const result = res.result as companyInput
    expect(res.code).toBe(200)
    expect(result.id).toBe(id)
    expect(result.name).toBe('Hello')
    expect(result.allowableLeaves).toBe(4)
    expect(result.allowableOvertime).toBe(6)
})

test('Get Companies', async() => {
    const companyParam = {}
    const res = await getCompany(companyParam)
    expect(res.code).toBe(200)
    
})

test('Delete Company', async() => {
    const companyParam = {}
    const res = await deleteCompany(id)
    expect(res.code).toBe(200)
    

})

// test('company list', ()=>{
//     const compList = data
//     const models = _.map(compList, (data) => new Company(
//         data.name as string,
//         data.allowableLeaves as number,
//         data.allowableOvertime as number
//         ))

//     _.each(compList, (data, index)=>{
//         expect(models[index].name).toBe(data.name)
//         expect(models[index].allowableLeaves).toBe(data.allowableLeaves)
//         expect(models[index].allowableOvertime).toBe(data.allowableOvertime)
//     })
// })