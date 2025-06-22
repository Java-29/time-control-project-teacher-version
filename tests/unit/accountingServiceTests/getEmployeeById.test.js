var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AccountingServiceMongoImpl } from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import { EmployeeModel } from "../../../src/model/mongoSchemas.js";
jest.mock('../../../src/model/mongoSchemas.js');
describe('AccountingServiceMongoImpl.getEmployeeById', () => {
    let service;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Failed test: employee not found', () => __awaiter(void 0, void 0, void 0, function* () {
        EmployeeModel.findOne.mockResolvedValue(null);
        yield expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow('Employee with id UNKNOWN not found');
    }));
    test('Passed test: receive employee', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockEmployee = {
            firstName: 'mockEmployee',
            lastName: 'mockEmployee',
            id: '123',
            table_num: 'table-num',
            hash: '464675678689',
            roles: ['crew']
        };
        EmployeeModel.findOne.mockResolvedValue(mockEmployee);
        const result = yield service.getEmployeeById('123');
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: '123' });
        expect(result).toEqual(mockEmployee);
    }));
});
