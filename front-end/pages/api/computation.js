import axios from 'axios'
import * as jose from 'jose'
import { encrypt } from './jwt'

const api = axios.create({
    baseURL: 'http://localhost:8080/employee'
  })
  
export const getAbsence= (employeeId) =>{
    const result = api.get(`/absence/${employeeId}`)
    //   console.log(result)
    return result
}
