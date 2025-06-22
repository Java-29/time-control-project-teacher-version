import express from "express";
import asyncHandler from "express-async-handler";
import {AuthRequest, LoginData} from "../utils/timeControlTypes.js";
import {Request, Response} from "express";
import {ShiftController} from "../controllers/ShiftController.js";

export const shiftControlRouter = express.Router();
const controller = new ShiftController();
shiftControlRouter.post('/', asyncHandler(async (req:AuthRequest, res:Response) => {
    const userId = req.userId as string;
    const result = await controller.toShift(userId);
    res.send(result)
}));

shiftControlRouter.patch('/', asyncHandler(async (req:AuthRequest, res:Response) => {
    const userId = req.userId as string;
    const result = await controller.fromShift(userId);
    res.send(result)
}))

shiftControlRouter.put('/', asyncHandler(async (req:AuthRequest, res:Response) => {
    const userId = req.userId as string;
    const {breakDuration} = req.query;
    const result = await controller.addBreak(userId,breakDuration as string);
    res.send(result)
}))