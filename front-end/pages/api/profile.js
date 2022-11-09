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
    baseURL: 'http://localhost:8080/profile'
  })
  

  export const getProfiles = () =>{
      const result = api.get(`/`, header)
        // console.log(result)
      return result
  }
  export const getProfile = (id) =>{
    const result = api.get(`/${id}`, header)
    //   console.log(result)
    return result
}
  export const updateProfile = async(id,credentials) =>{
    const token = await encrypt(credentials)
    console.log(id)
      const result = api.put(`/${id}`, JSON.stringify(token), header)
      return result
  }
  