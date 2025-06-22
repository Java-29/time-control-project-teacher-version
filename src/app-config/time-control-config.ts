import confJson from '../../config/time-control-config.json' with {type:'json'}
import dotenv from 'dotenv'
import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../services/AccountingService/AccountingServiceMongoImpl.js";
import {Role} from "../utils/timeControlTypes.js";

export interface AppConfig {
    port:number,
    skipPaths:string[],
    pathsRoles:Record<string, string[]>
    mongo_key:string,
    jwt:{
        secret:string,
        exp_time:string|number
    },
    accountingService: AccountingService

}

dotenv.config()
export const configuration:AppConfig = {
    ...confJson,
    mongo_key: process.env.TIME_CONTROL_MONGO_DB!,
    jwt:{
        secret: process.env.SECRET_JWT!,
        exp_time:"1h"
    },
    accountingService: new AccountingServiceMongoImpl()
}