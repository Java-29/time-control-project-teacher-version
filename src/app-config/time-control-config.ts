import confJson from '../../config/time-control-config.json' with {type:'json'}
import dotenv from 'dotenv'

export interface AppConfig {
    port:number,
    mongo_key:string
}

dotenv.config()
export const configuration:AppConfig = {
    ...confJson,
    mongo_key: process.env.TIME_CONTROL_MONGO_DB!
}