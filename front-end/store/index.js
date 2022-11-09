import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from './reducers/employee.js'
import companyReducer from './reducers/company.js'
import employerReducer from './reducers/employer.js'
import accountReducer from './reducers/account.js'
import loginReducer from './reducers/login.js'
// import 
export const store =  configureStore({
    reducer: {
        employee: employeeReducer,
        employer: employerReducer,
        company: companyReducer,
        account: accountReducer,
        login: loginReducer
    }
})