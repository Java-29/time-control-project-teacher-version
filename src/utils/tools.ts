import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";
import {Role} from "./timeControlTypes.js";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import {FiredEmployeeModel, FiredEmployeeMongoSchema} from "../model/mongoSchemas.js";
import {configuration} from "../app-config/time-control-config.js";
import jwt from "jsonwebtoken";

export const convertEmployeeDtoToEmployee = async (dto: EmployeeDto) => {
    const employee: Employee = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: await bcrypt.hash(dto.password, bcrypt.genSaltSync(10)),
        id: dto.id,
        roles: [Role.CREW],
        table_num: uuidv4()
    }
    return employee;
}

export const checkFiredEmployees = async(id:string) => {
    if(await FiredEmployeeModel.findOne({id}))
        throw new Error(JSON.stringify({status:409, message: "This employee was fired"}))
}

export const convertEmployeeToFiredEmployeeDto = (emp:Employee) => {
    const firedEmp:SavedFiredEmployee = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        id: emp.id,
        table_num:emp.table_num,
        fireDate: new Date().toDateString()
    }
    return firedEmp;
}

export const getError = (status:number, message:string) => JSON.stringify({status,message})

export const checkRole = (role:string) => {
    const newRole = Object.values(Role).find(r => r === role)
    if(!newRole) throw new Error(getError(400, "Wrong role!"))
    return newRole;
}

export const getJWT = (userId: string, roles: Role[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secretKey = configuration.jwt.secret;
    const options = {
        expiresIn: configuration.jwt.exp_time as any,
        subject: userId
    }
    return jwt.sign(payload, secretKey, options)
}