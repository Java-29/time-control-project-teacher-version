import {LoginData} from "../utils/timeControlTypes.js";
import {ShiftDataMongoSchema} from "../model/mongoSchemas.js";
import {TimeCheckServiceMongoImpl} from "../services/TimeCheckService/TimeCheckServiceMongoImpl.js";
import {TimeCheckService} from "../services/TimeCheckService/TimeCheckService.js";

export class ShiftController {
    private service:TimeCheckService = new TimeCheckServiceMongoImpl()

    async toShift(userId:string) {
        return await this.service.openShift(userId)
    }

    async fromShift(userId: string) {
        return await this.service.closeShift(userId)
    }

    async addBreak(userId: string, breakDuration: string ) {
        return await this.service.breakTime(userId, +breakDuration)
    }
}