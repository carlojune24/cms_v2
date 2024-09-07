import Express, { Request, Response } from "express";

import * as Mysql from "./Mysql";

export const v1 = async () => {

    const express = Express.Router();
    
    const database:any = await Mysql.connect();
    
    express.use('/', (request:Request, reply:Response, next:() => void) => {

        next();
    });

    express.get('/example', (request:Request, reply:Response) => {
        const { result, error } = database.sample;
        if (error) return reply.status(500).json({ error });
        reply.json({ result });
    });

    express.get('/example/:uuid', (request:Request, reply:Response) => {

    });

    express.post('/example', (request:Request, reply:Response) => {

    });

    express.put('/example/:uuid', (request:Request, reply:Response) => {

    });

    express.delete('/example', (request:Request, reply:Response) => {

    });

    return express;
}