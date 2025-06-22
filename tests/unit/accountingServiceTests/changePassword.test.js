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
import bcrypt from "bcrypt";
jest.mock("../../../src/model/mongoSchemas.js");
jest.mock('bcrypt');
describe('changePassword', () => {
    const mockPassword = 'newpass123';
    const mockHash = 'hashedPassword';
    let service;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
        bcrypt.hash.mockResolvedValue(mockHash);
        const execMock = jest.fn().mockResolvedValue({ acknowledged: true });
        EmployeeModel.updateOne.mockReturnValue({ exec: execMock });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Failed test: employee to fire not found', () => __awaiter(void 0, void 0, void 0, function* () {
        service.getEmployeeById = jest.fn().mockRejectedValue(new Error("Error: not found"));
        yield expect(service.fireEmployee('UNKNOWN')).rejects.toThrow("Error: not found");
    }));
    test('should successfully change password', () => __awaiter(void 0, void 0, void 0, function* () {
        service.getEmployeeById = jest.fn().mockResolvedValue({ id: '123' });
        yield expect(service.changePassword('123', mockPassword)).resolves.toBeUndefined();
        expect(service.getEmployeeById).toHaveBeenCalledWith('123');
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, undefined);
        expect(EmployeeModel.updateOne).toHaveBeenCalledWith({ id: '123' }, { hash: mockHash });
    }));
    test('should throw an error if updateOne returns falsy', () => __awaiter(void 0, void 0, void 0, function* () {
        service.getEmployeeById = jest.fn().mockResolvedValue({ id: '123' });
        EmployeeModel.updateOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        yield expect(service.changePassword('123', mockPassword)).rejects.toThrow('Password not updated');
    }));
});
