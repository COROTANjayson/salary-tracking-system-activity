import axios from 'axios'
import * as jose from 'jose'
import { encrypt } from './jwt'
// import * as dotenv from "dotenv";
// dotenv.config();
// require('dotenv').config()
const AuthToken = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('token')) : null
// console.log('token',AuthToken)

const header = {
  headers: {
    'Authorization': `Bearer ${AuthToken}`
  },
}

const api = axios.create({
    baseURL: 'http://localhost:8080/employer'
  })

  export const getEmployers = () =>{
      const result = api.get(`/`, header)
        // console.log(result)
      return result
  }
  export const getEmployer = (id) =>{
    const result = api.get(`/${id}`, header)
    //   console.log(result)
    return result
}
  export const createEmployer = async(credentials) =>{
    const token = await encrypt(credentials)
      const result = api.post(`/`, JSON.stringify(token),header )
      return result
  }
  export const updateEmployer = async(id,credentials) =>{
    const token = await encrypt(credentials)
    console.log(id)
      const result = api.put(`/${id}`, JSON.stringify(token), header)
      return result
  }
  
  export const deleteEmployer = (employerId, accountId) => {
    const result = api.delete(`/${employerId}/${accountId}`, header)
      console.log(result)
    return result
}