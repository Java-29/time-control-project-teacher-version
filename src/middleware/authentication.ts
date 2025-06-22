
import {Request, Response, NextFunction} from "express";
import bcrypt from 'bcryptjs';
import jwt, {JwtPayload} from "jsonwebtoken";
import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {AuthRequest, Role} from "../utils/timeControlTypes.js";
import {configuration} from "../app-config/time-control-config.js";
const BASIC = "Basic ";
const BEARER = "Bearer "
async function basicAuth(header: string, req: AuthRequest, service: AccountingService) {

    const authToken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
    console.log(authToken);
    const [userId, password] = authToken.split(":")
    if(userId === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.userId = "GURU";
        req.role = [Role.SUP];
        console.log(req.role)
    } else
        try {
        const account = await service.getEmployeeById(userId!);
        if(bcrypt.compareSync(password,account.hash)){
            req.userId = userId;
            req.role = account.roles;
            console.log("reader authenticated")
        }
    } catch (e) {
        console.log("reader not authenticated")
    }

}

async function jwtAuth(header: string, req: AuthRequest) {
   const token = header.substring(BEARER.length)
    try {
        const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
        req.userId = payload.sub;
        req.role = JSON.parse(payload.roles)
        console.log("reader authenticated by JWT")
    } catch (e) {
        console.log("reader not authenticated by JWT")
    }
}

export const authenticate = (service:AccountingService) =>
async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    console.log(header);
    if (header) {
        if(header.startsWith(BASIC)) await basicAuth(header, req, service);
        else if(header.startsWith(BEARER)) await jwtAuth(header, req)
    }
    next();
}

export const skipRoutes = (skipRoutes:string[]) =>
    (req:AuthRequest, res:Response,next:NextFunction) => {
    const pathMethod = req.method + req.path;
        console.log(pathMethod)
    if(!skipRoutes.includes(pathMethod) && !req.userId)
        throw new Error(JSON.stringify({status:401, message:"Go and login!"}))
    else next();
}