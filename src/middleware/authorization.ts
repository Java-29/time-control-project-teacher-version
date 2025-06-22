
import {NextFunction, Response} from "express";
import {normalizePath} from "../utils/tools.js";
import {AuthRequest, Role} from "../utils/timeControlTypes.js";


export const authorize = (arr:Record<string, string[]>) =>
    (req: AuthRequest, res:Response, next: NextFunction) => {
        const pathMethod = req.method + normalizePath(req.path);
        const roles = req.role as string[];
        // if(!roles || arr[pathMethod].includes(roles)) //ToDo incorrect request for registration with user
        if(!roles&&pathMethod==="POST/accounts/login" || roles!.some(item => arr[pathMethod].includes(item))) //ToDo incorrect request for registration with user
            next();
        else throw new Error(JSON.stringify({status: 403, message:"Required another role"}))
    }