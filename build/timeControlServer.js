import express from 'express';
import { configuration } from "./app-config/time-control-config.js";
import { accountRouter } from "./routers/accountRouter.js";
import mongoose from "mongoose";
import { errorHandler } from "./errorHandler/errorHandler.js";
import * as fs from "node:fs";
import morgan from 'morgan';
import { validateBody } from "./middleware/validation.js";
import { joiSchemas } from "./utils/joiSchemas.js";
export const launchServer = () => {
    const app = express();
    mongoose.connect(configuration.mongo_key).then(() => console.log("Server connected with Mongo"))
        .catch((err) => console.log(err));
    const logStream = fs.createWriteStream('./src/access.log', { flags: "a" });
    app.listen(configuration.port, () => {
        console.log(`server starts at http://localhost:${configuration.port}`);
    });
    app.use(morgan('dev'));
    app.use(morgan('combined', { stream: logStream }));
    app.use(express.json());
    app.use(validateBody(joiSchemas));
    app.use('/accounts', accountRouter);
    app.use(errorHandler);
};
