import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {checkFiredEmployees} from "../../../src/utils/tools.js";
import {Role} from "../../../src/utils/timeControlTypes.js";
import {EmployeeModel} from "../../../src/model/mongoSchemas.js";
jest.mock("../../../src/utils/tools.js");
jest.mock("../../../src/model/mongoSchemas.js")


describe('AccountingServiceMongoImpl.hireEmployee', () => {
    let service: AccountingService;
    beforeEach(() =>{
        service = new AccountingServiceMongoImpl()
    })
    afterEach(()=> {
        jest.clearAllMocks();
    })
    const mockEmployee = {
        firstName: 'mockEmployee',
        lastName: 'mockEmployee',
        id: '123',
        table_num: 'table-num',
        hash: '464675678689',
        roles: [Role.CREW]
    };

    test('Failed test: employee was fired later',async () => {
        (checkFiredEmployees as jest.Mock).mockRejectedValue(new Error("mock Error"));
        await expect(service.hireEmployee(mockEmployee)).rejects.toThrow("mock Error")
    })

    test('Failed test: employee already exists', async () => {
        (checkFiredEmployees as jest.Mock).mockResolvedValue(undefined);
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(mockEmployee);

        await expect(service.hireEmployee(mockEmployee))
            .rejects.toThrow(`Employee with tab number ${mockEmployee.id} already exists`)

        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee.id)
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({id:mockEmployee.id});
    })
    test('Passed test', async () => {
        (checkFiredEmployees as jest.Mock).mockResolvedValue(undefined);
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(undefined);

        const mockSave = jest.fn().mockResolvedValue(mockEmployee);

        (EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: mockSave
        }))

        const result = await service.hireEmployee(mockEmployee);

        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee.id)
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({id:mockEmployee.id});

        expect(result).toEqual(mockEmployee);
    })
})