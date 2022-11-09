import { createSlice } from "@reduxjs/toolkit";
// import { getCompaniesAPI  } from "../../pages/api/company";


const companyList = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('companyList')): null
const data = companyList !== null||undefined ? companyList : []
// let data = getCompaniesAPI()
// console.log('hi',data)
export const companyStore = createSlice({
    name: 'company',
    initialState:{
        counter: 0,
        companyList: data,
        data: {
            id: '',
            name: '',
            leaves: '',
            overtimeLimit: '',
        },
    },
    reducers: {
        setCounter: (state)=>{
            state.counter += 1
        },
        setCompany: (state, action) => {
            state.data = action.payload
        },
        addCompany: (state, action) => {
            const data = action.payload
            
            const companyList = JSON.parse(localStorage.getItem('companyList') || '[]' )
            if(companyList.length==0){
                state.companyList.push(data)
                localStorage.setItem('companyList', JSON.stringify(state.companyList))
            } else {
                    const empData = _.find(companyList, {'id': data.id})
                    if(!empData){
                        state.companyList = [...companyList, data]
                        localStorage.setItem('companyList', JSON.stringify(state.companyList))
            }
            }
        },
        updateCompany: (state, action) => {
            const {id, data} = action.payload
            const companyList = JSON.parse(localStorage.getItem('companyList') || '[]' )
                const result = companyList.map((value, i) => {
                    if(id=== value.id){
                        value.name =data.name
                        value.leaves = data.leaves
                        value.overtimeLimit = data.overtimeLimit
                    }
                    return value
                })
            
            state.companyList = [...result]
            // Perform localStorage action
            localStorage.setItem('companyList', JSON.stringify(state.companyList))
        },
        removeCompany: (state, action) => {
            const id = action.payload
            const result = _.filter(state.companyList, v => v.id!== id);
            state.companyList = [...result]
            localStorage.setItem('companyList', JSON.stringify(state.companyList))
        },
        getCompany: (state, action) => {
            state.companyList.push(action.payload)
        },
    
    }
})

export const {setCompany, addCompany, removeCompany, updateCompany, getCompany, setCounter} = companyStore.actions

export const getCompanies= (state) => state.company.companyList;

export default companyStore.reducer