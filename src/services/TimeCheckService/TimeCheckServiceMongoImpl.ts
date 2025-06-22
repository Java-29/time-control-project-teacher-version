import {TimeCheckService} from "./TimeCheckService.js";
import {ShiftControlModel} from "../../model/mongoSchemas.js";
import {ShiftRecord} from "../../utils/timeControlTypes.js";
import {getError} from "../../utils/tools.js";

export class TimeCheckServiceMongoImpl implements TimeCheckService{
    async breakTime(userId: string, breakTime: number): Promise<void> {
        //================looking for opened shifts============================
        const openShifts = await ShiftControlModel.find<ShiftRecord>({userId, shiftFinish: null})
        if (openShifts.length === 0 || openShifts.length > 1)
            throw new Error(getError(409, "Shift control  problem.  Opened shifts not found. Contact shift-manager"));
       const breaks = openShifts[0].breaks;
       breaks.push(breakTime)
        await ShiftControlModel.findOneAndUpdate({userId, shiftFinish:null},{
            $set:{ breaks }
        })
    }

    async closeShift(userId: string): Promise<number> {
        //================looking for opened shifts============================
        const openShifts = await ShiftControlModel.find<ShiftRecord>({userId, shiftFinish: null})
        if (openShifts.length === 0 || openShifts.length > 1)
            throw new Error(getError(409, "ShiftClosing  problem. Contact shift-manager"));
        const closeShiftTime = new Date();
        const shiftDurationMs = closeShiftTime.getTime() - new Date(openShifts[0].shiftStart).getTime();

        await ShiftControlModel.findOneAndUpdate({userId, shiftFinish:null},{
            $set:{shiftFinish: closeShiftTime.toISOString() }
        })
        return Promise.resolve(shiftDurationMs/60000);
    }

    async openShift(userId: string): Promise<string> {
        //================looking for opened shifts============================
        const openShifts = await ShiftControlModel.find<ShiftRecord>({userId, shiftFinish: null})
        if(openShifts.length !== 0)
            throw new Error(getError(409, "Shift just opened. Contact shift-manager"));
        const newShift:ShiftRecord = {
            userId,
            breaks: [],
            shiftStart: new Date().toISOString(),
        }
        console.log(newShift)
        const shiftDoc = new ShiftControlModel(newShift);
        await shiftDoc.save()
        return Promise.resolve(newShift.shiftStart);
    }

}