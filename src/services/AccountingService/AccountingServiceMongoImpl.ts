import {AccountingService} from "./AccountingService.js";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../../model/Employee.js";
import {EmployeeModel, FiredEmployeeModel} from "../../model/mongoSchemas.js";
import {checkFiredEmployees, checkRole, convertEmployeeToFiredEmployeeDto, getError} from "../../utils/tools.js";
import bcrypt from "bcrypt";

export class AccountingServiceMongoImpl implements AccountingService{

    async changePassword(empId: string, newPassword: string): Promise<void> {
        await this.getEmployeeById(empId);
       const res = await EmployeeModel.updateOne({id:empId},{
            hash: await bcrypt.hash(newPassword, bcrypt.genSaltSync(10))
        }).exec()
        if(!res) throw new Error(getError(500,"Password not updated"))
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const emp = await this.getEmployeeById(empId);
        const firedEmp = convertEmployeeToFiredEmployeeDto(emp);
        await EmployeeModel.findOneAndDelete({id:empId}).exec();
        const firedEmpDoc = new FiredEmployeeModel(firedEmp);
        await firedEmpDoc.save();
        return firedEmp;
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result: Employee[] = await EmployeeModel.find({})
        return Promise.resolve(result);
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const result = await EmployeeModel.findOne({id});
        if(!result) throw new Error(getError(404, `Employee with id ${id} not found`))
        return result as Employee
    }

    async hireEmployee(employee: Employee): Promise<Employee> {

        await checkFiredEmployees(employee.id)
            if (await EmployeeModel.findOne({id: employee.id}))
                throw new Error(JSON.stringify({
                    status: 409,
                    message: `Employee with tab number ${employee.id} already exists`
                }))
                const employeeDoc = new EmployeeModel(employee)
                await employeeDoc.save();
                return employee;
    }

    async setRole(id: string, newRole: string): Promise<Employee> {
        const emp = await this.getEmployeeById(id)
        const role = checkRole(newRole);
        console.log(emp.roles)
        emp.roles.push(role);
        const updated = await EmployeeModel.findOneAndUpdate({id}, {
          $set:{roles: emp.roles}
        }, {new:true}).exec();
        if(!updated)throw new Error(getError(500, "Employee updating failed!"))
        return updated as Employee
    }

    async updateEmployee(empId: string, employee: EmployeeDto): Promise<Employee> {
        const emp = await EmployeeModel.findOne({id:empId})
        if(!emp) throw new Error(getError(404, `Employee with id ${empId} not found`))

        const updated = await EmployeeModel.findByIdAndUpdate<Employee>(emp._id, {
            firstName : employee.firstName,
            lastName : employee.lastName
        }, {new:true}).exec();
        if(!updated)throw new Error(getError(500, "Employee updating failed!"))
        return updated as Employee
    }

}