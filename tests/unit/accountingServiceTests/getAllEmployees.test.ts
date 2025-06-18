import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/mongoSchemas.js";
jest.mock("../../../src/model/mongoSchemas.js")
describe('AccountingServiceMongoImpl.getAllEmployees', () => {
    let service: AccountingService
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
    const empArr = [{id: '1'}, {id:'2'}]
    test('Test passed: There are some employees', async () => {
        (EmployeeModel.find as jest.Mock).mockResolvedValue(empArr);
        const result = await service.getAllEmployees();
        expect(EmployeeModel.find).toHaveBeenCalledWith({});
        expect(result).toEqual(empArr)
    })

    test("Test passed: There aren't any employees", async () => {
        (EmployeeModel.find as jest.Mock).mockResolvedValue([]);
        const result = await service.getAllEmployees();
        expect(EmployeeModel.find).toHaveBeenCalledWith({});
        expect(result).toEqual([])
    })
})