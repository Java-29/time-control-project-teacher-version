import {NextFunction, Request, Response} from "express";
import {getError} from "../utils/tools.js";
import Joi from "joi";

export const validateBody = (joiSchemas:Record<string, Joi.ObjectSchema>) =>
    (req:Request, res:Response, next:NextFunction) => {
    if(req.body){
        const endpoint = req.method+req.path;
        const schema:Joi.ObjectSchema = joiSchemas[endpoint];
        if(!schema) throw new Error(getError(500,"validation schema not found"))
        const {error} = schema.validate(req.body)
        if(error) throw new Error(getError(400, error.message))
    }
    next();
    }