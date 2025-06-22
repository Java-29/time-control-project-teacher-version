import express, {Request, Response} from "express";

import asyncHandler from "express-async-handler"
import {EmployeeDto} from "../model/Employee.js";
import {AccountController} from "../controllers/AccountController.js";
import {AuthRequest, LoginData} from "../utils/timeControlTypes.js";
export const accountRouter = express.Router()
const controller = new AccountController();

accountRouter.post('/', asyncHandler(async (req:Request, res:Response) => {
        const body = req.body as EmployeeDto
    const result = await controller.addEmployee(body);
        res.status(201).json(result)
}))

accountRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.getAllEmployees();
    res.json(result)
}))

accountRouter.put('/', asyncHandler(async (req: Request, res: Response) => {
const body = req.body as EmployeeDto;
    const result = await controller.updateEmployee(body);
    res.json(result)
}))

accountRouter.get('/account', asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.query;
    const result = await  controller.getEmployeeById(id as string)
    res.json(result)
}))
accountRouter.patch('/account', asyncHandler(async (req: Request, res: Response) =>{
    const {id} = req.query;
    await controller.changePassword(id as string, req.body.newPassword as string)
    res.send();
}))

accountRouter.delete('/account', asyncHandler(async (req: Request, res: Response) =>{
    const {id} = req.query;
   const result =  await controller.deleteEmployee(id as string)
    res.json(result);
}))

accountRouter.patch('/role', asyncHandler(async (req: Request, res: Response) =>{
    const {id, newRole} = req.query;
    const result =  await controller.setRole(id as string, newRole as string)
    res.json(result);
}))

accountRouter.post('/login', asyncHandler(async (req: AuthRequest, res: Response) => {
     const body = req.body as LoginData
    const token = await  controller.login(body)
    res.send(token);
}))