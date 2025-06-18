var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AccountingServiceMongoImpl } from "../services/AccountingService/AccountingServiceMongoImpl.js";
import { convertEmployeeDtoToEmployee } from "../utils/tools.js";
export class AccountController {
    constructor() {
        this.service = new AccountingServiceMongoImpl();
    }
    addEmployee(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield convertEmployeeDtoToEmployee(body);
            return yield this.service.hireEmployee(employee);
        });
    }
    getAllEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getAllEmployees();
        });
    }
    updateEmployee(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.updateEmployee(body.id, body);
        });
    }
    getEmployeeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getEmployeeById(id);
        });
    }
    changePassword(id, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.changePassword(id, newPass);
        });
    }
    deleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.fireEmployee(id);
        });
    }
}
