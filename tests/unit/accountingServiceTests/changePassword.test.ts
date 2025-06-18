import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/mongoSchemas.js";
import bcrypt from "bcrypt";
jest.mock("../../../src/model/mongoSchemas.js")
jest.mock('bcrypt');

describe('changePassword', () => {

    const mockPassword = 'newpass123';
    const mockHash = 'hashedPassword';

    let service: AccountingService;

    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
        const execMock = jest.fn().mockResolvedValue({ acknowledged: true });
        (EmployeeModel.updateOne as jest.Mock).mockReturnValue({ exec: execMock });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Failed test: employee to fire not found', async () => {
        (service.getEmployeeById as jest.Mock) = jest.fn().mockRejectedValue(new Error("Error: not found"));
        await expect(service.changePassword('UNKNOWN', mockPassword)).rejects.toThrow("Error: not found")
    });

    test('should successfully change password', async () => {
        (service.getEmployeeById as jest.Mock) = jest.fn().mockResolvedValue({id: '123'});
        await expect(service.changePassword('123', mockPassword)).resolves.toBeUndefined();

        expect(service.getEmployeeById).toHaveBeenCalledWith('123');
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, undefined);
        expect(EmployeeModel.updateOne).toHaveBeenCalledWith(
            { id: '123' },
            { hash: mockHash }
        );
    });

    test('should throw an error if updateOne returns falsy', async () => {
        (service.getEmployeeById as jest.Mock) = jest.fn().mockResolvedValue({id: '123'});
        (EmployeeModel.updateOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        await expect(service.changePassword('123', mockPassword)).rejects.toThrow('Password not updated');
    });
});