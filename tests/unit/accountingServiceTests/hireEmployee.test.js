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
import { checkFiredEmployees } from "../../../src/utils/tools.js";
import { Role } from "../../../src/utils/timeControlTypes.js";
import { EmployeeModel } from "../../../src/model/mongoSchemas.js";
jest.mock("../../../src/utils/tools.js");
jest.mock("../../../src/model/mongoSchemas.js");
describe('AccountingServiceMongoImpl.hireEmployee', () => {
    let service;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockEmployee = {
        firstName: 'mockEmployee',
        lastName: 'mockEmployee',
        id: '123',
        table_num: 'table-num',
        hash: '464675678689',
        roles: [Role.CREW]
    };
    test('Failed test: employee was fired later', () => __awaiter(void 0, void 0, void 0, function* () {
        checkFiredEmployees.mockRejectedValue(new Error("mock Error"));
        yield expect(service.hireEmployee(mockEmployee)).rejects.toThrow("mock Error");
    }));
    test('Failed test: employee already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        checkFiredEmployees.mockResolvedValue(undefined);
        EmployeeModel.findOne.mockResolvedValue(mockEmployee);
        yield expect(service.hireEmployee(mockEmployee))
            .rejects.toThrow(`Employee with tab number ${mockEmployee.id} already exists`);
        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee.id);
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: mockEmployee.id });
    }));
    test('Passed test', () => __awaiter(void 0, void 0, void 0, function* () {
        checkFiredEmployees.mockResolvedValue(undefined);
        EmployeeModel.findOne.mockResolvedValue(undefined);
        const mockSave = jest.fn().mockResolvedValue(mockEmployee);
        EmployeeModel.mockImplementation(() => ({
            save: mockSave
        }));
        const result = yield service.hireEmployee(mockEmployee);
        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee.id);
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: mockEmployee.id });
        expect(result).toEqual(mockEmployee);
    }));
});
