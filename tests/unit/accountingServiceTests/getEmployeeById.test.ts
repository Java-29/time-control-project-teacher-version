import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/mongoSchemas.js";
import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {Role} from "../../../src/utils/timeControlTypes.js";
jest.mock('../../../src/model/mongoSchemas.js')

describe('AccountingServiceMongoImpl.getEmployeeById', () => {
    let service: AccountingService
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('Failed test: employee not found', async () => {

        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow('Employee with id UNKNOWN not found')
    })

    test('Passed test: receive employee', async () => {
        const mockEmployee = {
            firstName: 'mockEmployee',
            lastName: 'mockEmployee',
            id: '123',
            table_num: 'table-num',
            hash: '464675678689',
            roles: ['crew']
        };
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(mockEmployee);
        const result = await service.getEmployeeById('123')
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({id:'123'})
        expect(result).toEqual(mockEmployee);
    })
})