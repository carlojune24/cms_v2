import Express from "express";
import ExpressCors from "cors";
import ExpressSession from "express-session";
import ExpressFileupload from "express-fileupload";

import * as Util from "../Util";
import { v1 } from "./Express.Router.v1";

let isListening = false;

export const listen = async () => {
    if (isListening) return console.error(`⚡️ [AIMS]: Express is already listening on port '${Util.env.FASTIFY_PORT}'`);
    isListening = true;

    const express = Express();
    
    express.use(ExpressCors);
    express.use(ExpressSession({
        secret: 'keyboard cat',
        cookie: { 
            path : '/',
            httpOnly : true,
            secure: false,
        }
    }));
    express.use(ExpressFileupload);
    
    express.use(`${Util.env.BASEHREF}/api/v1`, await v1());
    
    express.listen(Util.env.EXPRESS_PORT, () => {
        console.log(`⚡️ [AIMS]: Express Server is running at 'http://localhost:${Util.env.EXPRESS_PORT}${Util.env.BASEHREF}/api'`)
    });
}
