import {AccountingServiceMongoImpl} from "../services/AccountingService/AccountingServiceMongoImpl.js";
import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {EmployeeDto} from "../model/Employee.js";
import {checkRole, convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {configuration} from "../app-config/time-control-config.js";
import {LoginData} from "../utils/timeControlTypes.js";

export class AccountController {
    //private service:AccountingService = new AccountingServiceMongoImpl()
    private service:AccountingService = configuration.accountingService;

    async addEmployee(body: EmployeeDto) {
        const employee = await convertEmployeeDtoToEmployee(body);
        return await this.service.hireEmployee(employee)
    }

    async getAllEmployees() {
        return await this.service.getAllEmployees();
    }

    async updateEmployee(body: EmployeeDto) {
        return await  this.service.updateEmployee(body.id as string, body);
    }

    async getEmployeeById(id: string) {
        return await this.service.getEmployeeById(id)
    }

    async changePassword(id: string, newPass: string) {
        await this.service.changePassword(id, newPass)
    }

    async deleteEmployee(id: string) {
        return await this.service.fireEmployee(id)
    }

    async setRole(id: string, newRole: string) {
        return await this.service.setRole(id, newRole)
    }

    async login(body: LoginData) {
        return await this.service.login(body)
    }
}