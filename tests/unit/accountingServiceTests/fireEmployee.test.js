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
import { EmployeeModel, FiredEmployeeModel } from "../../../src/model/mongoSchemas.js";
import { convertEmployeeToFiredEmployeeDto } from "../../../src/utils/tools.js";
jest.mock("../../../src/model/mongoSchemas.js");
jest.mock("../../../src/utils/tools.js");
describe('AccountingServiceMongoImpl.fireEmployee', () => {
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
    const firedMockEmployee = {
        firstName: 'mockFiredEmp',
        lastName: 'mockFiredEmp',
        id: '123',
        table_num: 'table_num',
        fireDate: 'fire_date',
    };
    test('Failed test: employee to fire not found', () => __awaiter(void 0, void 0, void 0, function* () {
        service.getEmployeeById = jest.fn().mockRejectedValue(new Error("Error: not found"));
        yield expect(service.fireEmployee('UNKNOWN')).rejects.toThrow("Error: not found");
    }));
    test('Passed test', () => __awaiter(void 0, void 0, void 0, function* () {
        service.getEmployeeById = jest.fn().mockResolvedValue(mockEmployee);
        convertEmployeeToFiredEmployeeDto.mockReturnValue(firedMockEmployee);
        const mockExec = jest.fn().mockResolvedValue({});
        EmployeeModel.findOneAndDelete.mockImplementation(() => ({ exec: mockExec }));
        const mockSave = jest.fn().mockResolvedValue(firedMockEmployee);
        FiredEmployeeModel.mockImplementation(() => ({
            save: mockSave
        }));
        const result = yield service.fireEmployee('123');
        expect(service.getEmployeeById).toHaveBeenCalledWith('123');
        expect(convertEmployeeToFiredEmployeeDto).toHaveBeenCalledWith(mockEmployee);
        expect(EmployeeModel.findOneAndDelete).toHaveBeenCalledWith({ id: '123' });
        expect(result).toEqual(firedMockEmployee);
    }));
});
