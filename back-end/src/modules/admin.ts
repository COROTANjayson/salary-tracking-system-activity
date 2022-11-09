import {v4 as uuidv4} from 'uuid'
import { Account } from './account';
export class Admin extends Account{
    adminId: string;
    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: string,
        accountId: string,
        adminId?: string,
        ) {
            super( firstName,
                lastName,
                email,
                password,
                role,
                accountId)
            this.adminId = (adminId === undefined)? uuidv4() : adminId
        }
}