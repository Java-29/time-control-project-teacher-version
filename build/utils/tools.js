var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Role } from "./timeControlTypes.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { FiredEmployeeModel } from "../model/mongoSchemas.js";
export const convertEmployeeDtoToEmployee = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: yield bcrypt.hash(dto.password, bcrypt.genSaltSync(10)),
        id: dto.id,
        roles: [Role.CREW],
        table_num: uuidv4()
    };
    return employee;
});
export const checkFiredEmployees = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield FiredEmployeeModel.findOne({ id }))
        throw new Error(JSON.stringify({ status: 409, message: "This employee was fired" }));
});
export const convertEmployeeToFiredEmployeeDto = (emp) => {
    const firedEmp = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        id: emp.id,
        table_num: emp.table_num,
        fireDate: new Date().toDateString()
    };
    return firedEmp;
};
export const getError = (status, message) => JSON.stringify({ status, message });
