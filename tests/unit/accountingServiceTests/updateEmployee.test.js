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
import { Role } from "../../../src/utils/timeControlTypes.js";
import { EmployeeModel } from "../../../src/model/mongoSchemas.js";
jest.mock("../../../src/model/mongoSchemas.js");
describe('AccountingServiceMongoImpl.updateEmployee', () => {
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
        _id: 'mongo_id',
        table_num: 'table-num',
        hash: '464675678689',
        roles: [Role.CREW]
    };
    const mockEmployeeDto = {
        firstName: 'mockFiredEmp',
        lastName: 'mockFiredEmp',
        id: '123',
        password: 'password'
    };
    const mockEmployeeUpdated = {
        firstName: 'mockFiredEmp',
        lastName: 'mockFiredEmp',
        id: '123',
        _id: 'mongo_id',
        table_num: 'table-num',
        hash: '464675678689',
        roles: [Role.CREW]
    };
    test('Failed test: employee to update not found', () => __awaiter(void 0, void 0, void 0, function* () {
        EmployeeModel.findOne.mockResolvedValue(null);
        yield expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow('Employee with id UNKNOWN not found');
    }));
    test('Failed test: unsuccessfully updating', () => __awaiter(void 0, void 0, void 0, function* () {
        EmployeeModel.findOne.mockResolvedValue(mockEmployee);
        const mockExec = jest.fn().mockResolvedValue(null);
        EmployeeModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });
        yield expect(service.updateEmployee('123', mockEmployeeDto)).rejects.toThrow("Employee updating failed!");
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: mockEmployeeDto.id });
    }));
    test('Passed test', () => __awaiter(void 0, void 0, void 0, function* () {
        EmployeeModel.findOne.mockResolvedValue(mockEmployee);
        const mockExec = jest.fn().mockResolvedValue(mockEmployeeUpdated);
        EmployeeModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });
        const result = yield service.updateEmployee('123', mockEmployeeDto);
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: mockEmployeeDto.id });
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmployee._id, {
            firstName: mockEmployeeDto.firstName,
            lastName: mockEmployeeDto.lastName
        }, { new: true });
        expect(result).toEqual(mockEmployeeUpdated);
    }));
});
