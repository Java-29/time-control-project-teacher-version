import * as mongoose from "mongoose";
import { Role } from "../utils/timeControlTypes.js";
export const EmployeeMongoSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    id: { type: String, required: true },
    table_num: { type: String, required: true },
    roles: { type: [String], enum: Role, required: true },
    hash: { type: String, required: true }
}, { versionKey: false });
export const EmployeeModel = mongoose.model('Employees', EmployeeMongoSchema, 'employees_accounting');
export const FiredEmployeeMongoSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    id: { type: String, required: true },
    table_num: { type: String, required: true },
    fireDate: { type: String, required: true }
}, { versionKey: false });
export const FiredEmployeeModel = mongoose.model('Fired', FiredEmployeeMongoSchema, 'fired_emp_collection');
