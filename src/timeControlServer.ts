import express from 'express'
import {configuration} from "./app-config/time-control-config.js";
import {accountRouter} from "./routers/accountRouter.js";
import mongoose from "mongoose";
import {errorHandler} from "./errorHandler/errorHandler.js";
import * as fs from "node:fs";
import morgan from 'morgan'
import {validateBody} from "./middleware/validation.js";
import {joiSchemas} from "./utils/joiSchemas.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import {authorize} from "./middleware/authorization.js";
import {shiftControlRouter} from "./routers/shiftControlRouter.js";

export const launchServer = () => {
    const app = express();
    //=================Mongo Connection===================
    mongoose.connect(configuration.mongo_key).then(() => console.log("Server connected with Mongo"))
        .catch((err: any) => console.log(err))
    const logStream = fs.createWriteStream('./src/access.log',{flags:"a"})
    //===============Server run===========================
    app.listen(configuration.port, () => {
        console.log(`server starts at http://localhost:${configuration.port}` )
    })
    //=============Middleware=============================
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}));
    app.use(authenticate(configuration.accountingService));
    app.use(skipRoutes(configuration.skipPaths))
    app.use(authorize(configuration.pathsRoles))
    app.use(express.json());
    app.use(validateBody(joiSchemas));
    //===============Routing==============================
    app.use('/accounts', accountRouter);
    app.use('/shifts', shiftControlRouter);
    //==============ErrorHandler===================
    app.use(errorHandler);
}