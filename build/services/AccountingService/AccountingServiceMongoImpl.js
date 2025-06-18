var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EmployeeModel, FiredEmployeeModel } from "../../model/mongoSchemas.js";
import { checkFiredEmployees, convertEmployeeToFiredEmployeeDto, getError } from "../../utils/tools.js";
import bcrypt from "bcrypt";
export class AccountingServiceMongoImpl {
    changePassword(empId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getEmployeeById(empId);
            const res = yield EmployeeModel.updateOne({ id: empId }, {
                hash: yield bcrypt.hash(newPassword, bcrypt.genSaltSync(10))
            }).exec();
            if (!res)
                throw new Error(getError(500, "Password not updated"));
        });
    }
    fireEmployee(empId) {
        return __awaiter(this, void 0, void 0, function* () {
            const emp = yield this.getEmployeeById(empId);
            const firedEmp = convertEmployeeToFiredEmployeeDto(emp);
            yield EmployeeModel.findOneAndDelete({ id: empId }).exec();
            const firedEmpDoc = new FiredEmployeeModel(firedEmp);
            yield firedEmpDoc.save();
            return firedEmp;
        });
    }
    getAllEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield EmployeeModel.find({});
            return Promise.resolve(result);
        });
    }
    getEmployeeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield EmployeeModel.findOne({ id });
            if (!result)
                throw new Error(getError(404, `Employee with id ${id} not found`));
            return result;
        });
    }
    hireEmployee(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkFiredEmployees(employee.id);
            if (yield EmployeeModel.findOne({ id: employee.id }))
                throw new Error(JSON.stringify({
                    status: 409,
                    message: `Employee with tab number ${employee.id} already exists`
                }));
            const employeeDoc = new EmployeeModel(employee);
            yield employeeDoc.save();
            return employee;
        });
    }
    setRole(newRole) {
        throw "";
    }
    updateEmployee(empId, employee) {
        return __awaiter(this, void 0, void 0, function* () {
            const emp = yield EmployeeModel.findOne({ id: empId });
            if (!emp)
                throw new Error(getError(404, `Employee with id ${empId} not found`));
            const updated = yield EmployeeModel.findByIdAndUpdate(emp._id, {
                firstName: employee.firstName,
                lastName: employee.lastName
            }, { new: true }).exec();
            if (!updated)
                throw new Error(getError(500, "Employee updating failed!"));
            return updated;
        });
    }
}
