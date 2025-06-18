import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {Role} from "../../../src/utils/timeControlTypes.js";
import {EmployeeModel} from "../../../src/model/mongoSchemas.js";
jest.mock("../../../src/model/mongoSchemas.js");


describe('AccountingServiceMongoImpl.updateEmployee', () => {
    let service: AccountingService;
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
    }

    const mockEmployeeUpdated = {
        firstName: 'mockFiredEmp',
        lastName: 'mockFiredEmp',
        id: '123',
        _id: 'mongo_id',
        table_num: 'table-num',
        hash: '464675678689',
        roles: [Role.CREW]
    };

    test('Failed test: employee to update not found', async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.updateEmployee("UNKNOWN", mockEmployeeDto)).rejects.toThrow('Employee with id UNKNOWN not found')
    });

    test('Failed test: unsuccessfully updating', async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(mockEmployee);
        const mockExec = jest.fn().mockResolvedValue(null);
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({exec: mockExec});

        await expect(service.updateEmployee('123', mockEmployeeDto)).rejects.toThrow("Employee updating failed!")
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({id:mockEmployeeDto.id});
    })
    test('Passed test', async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(mockEmployee);
        const mockExec = jest.fn().mockResolvedValue(mockEmployeeUpdated);
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({exec: mockExec});

        const result = await service.updateEmployee('123', mockEmployeeDto);

        expect(EmployeeModel.findOne).toHaveBeenCalledWith({id: mockEmployeeDto.id})
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(mockEmployee._id, {
            firstName : mockEmployeeDto.firstName,
            lastName : mockEmployeeDto.lastName
        }, {new:true});
        expect(result).toEqual(mockEmployeeUpdated)
    })
})