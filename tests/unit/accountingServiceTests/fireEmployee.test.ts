import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {Role} from "../../../src/utils/timeControlTypes.js";
import {EmployeeModel, FiredEmployeeModel} from "../../../src/model/mongoSchemas.js";
import {convertEmployeeToFiredEmployeeDto} from "../../../src/utils/tools.js";
jest.mock("../../../src/model/mongoSchemas.js");
jest.mock("../../../src/utils/tools.js");

describe('AccountingServiceMongoImpl.fireEmployee', () => {
    let service:AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl()
    });
    afterEach(() => {
        jest.clearAllMocks()
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
        table_num:'table_num',
        fireDate:'fire_date',
    }
    test('Failed test: employee to fire not found', async () => {
        (service.getEmployeeById as jest.Mock) = jest.fn().mockRejectedValue(new Error("Error: not found"));
        await expect(service.fireEmployee('UNKNOWN')).rejects.toThrow("Error: not found")
    })

    test('Passed test', async () => {
        (service.getEmployeeById as jest.Mock) = jest.fn().mockResolvedValue(mockEmployee);
        (convertEmployeeToFiredEmployeeDto as jest.Mock).mockReturnValue(firedMockEmployee);
         const mockExec = jest.fn().mockResolvedValue({});
        (EmployeeModel.findOneAndDelete as jest.Mock).mockImplementation(() => ({exec:mockExec}));
        const mockSave = jest.fn().mockResolvedValue(firedMockEmployee);
        (FiredEmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: mockSave
        }));
        const result = await service.fireEmployee('123');

        expect(service.getEmployeeById).toHaveBeenCalledWith('123');
        expect(convertEmployeeToFiredEmployeeDto).toHaveBeenCalledWith(mockEmployee);
        expect(EmployeeModel.findOneAndDelete).toHaveBeenCalledWith({id:'123'});

        expect(result).toEqual(firedMockEmployee);

    })
})