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
    baseURL: 'http://localhost:8080/employee'
  })
const api2 = axios.create({
  baseURL: 'http://localhost:8080/employee'
})
  export const getEmployees = () =>{
      const result = api.get(`/`, header)
        // console.log(result)
      return result
  }
  export const getEmployee = (id) =>{
    const result = api.get(`/${id}`, header)
    //   console.log(result)
    return result
}
  export const createEmployee = async(credentials) =>{
    const token = await encrypt(credentials)
      const result = api.post(`/`, JSON.stringify(token), header)
      return result
  }
  export const updateEmployee = async(id,credentials) =>{
    const token = await encrypt(credentials)
    console.log(id)
      const result = api.put(`/${id}`, JSON.stringify(token), header)
      return result
  }
  
  export const deleteEmployee = (employeeId, accountId) => {
    const result = api.delete(`/${employeeId}/${accountId}`, header)
      console.log(result)
    return result
}

// -----------leave API----------------
export const getLeaves = (employeeId) =>{
    const result = api.get(`/leave/${employeeId}`, header)
    //   console.log(result)
    return result
}
export const createLeave = async(employeeId,credentials) =>{
    const token = await encrypt(credentials)
      const result = api.post(`/leave/${employeeId}`, JSON.stringify(token), header)
      return result
  }
export const updateLeave = async(leaveId,credentials) =>{
    const token = await encrypt(credentials)
    const result = api.put(`/leave/${leaveId}`, JSON.stringify(token), header)
    return result
}

export const deleteLeave= async(leaveId) =>{
    const result = api.delete(`/leave/${leaveId}`, header)
    return result
}
// -----------overtime API----------------
export const getOvertime = (employeeId) =>{
    const result = api.get(`/overtime/${employeeId}`, header)
    //   console.log(result)
    return result
}
export const createOvertime = async(employeeId,credentials) =>{
    const token = await encrypt(credentials)
      const result = api.post(`/overtime/${employeeId}`, JSON.stringify(token), header)
      return result
  }
export const updateOvertime = async(overtimeId,credentials) =>{
    const token = await encrypt(credentials)
    const result = api.put(`/overtime/${overtimeId}`, JSON.stringify(token), header)
    return result
}
export const deleteOvertime = async(overtimeId) =>{
    // const token = await encrypt(credentials)
    const result = api.delete(`/overtime/${overtimeId}`, header)
    return result
}

// -----------absence API----------------
export const getAbsence= (employeeId) =>{
    const result = api.get(`/absence/${employeeId}`, header)
    //   console.log(result)
    return result
}
export const createAbsence= async(employeeId,credentials) =>{
    const token = await encrypt(credentials)
      const result = api.post(`/absence/${employeeId}`, JSON.stringify(token), header)
      return result
  }

export const deleteAbsence= async(absenceId) =>{
    // const token = await encrypt(credentials)
    const result = api.delete(`/absence/${absenceId}`, header)
    return result
}

// ---------------computation--------------------
export const getLeavesRemaining= (employeeId) =>{
  const result = api.get(`/total-leaves-remaining/${employeeId}`, header)
  //   console.log(result)
  return result
}
export const getTotalAbsences= (employeeId) =>{
  const result = api.get(`/total-absences/${employeeId}`, header)
  //   console.log(result)
  return result
}
export const getTotalOvertime= (employeeId) =>{
  const result = api.get(`/total-overtime/${employeeId}`, header)
  //   console.log(result)
  return result
}
export const getDailyWage= (employeeId) =>{
  const result = api.get(`/daily-wage/${employeeId}`, header)
  //   console.log(result)
  return result
}
export const getMonthlySalary= (employeeId) =>{
  const result = api.get(`/monthly-salary/${employeeId}`, header)
  //   console.log(result)
  return result
}