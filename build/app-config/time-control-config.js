import confJson from '../../config/time-control-config.json' with { type: 'json' };
import dotenv from 'dotenv';
dotenv.config();
export const configuration = Object.assign(Object.assign({}, confJson), { mongo_key: process.env.TIME_CONTROL_MONGO_DB });
