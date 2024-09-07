import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import FastifyCors from '@fastify/cors'
import FastifyCookies from '@fastify/cookie';
import FastifySession from '@fastify/session';
import FastifyMultipart from '@fastify/multipart';

import * as Util from "../Util";
import { v1 } from "./Fastify.Routes.v1";

let isListening = false;

export const listen = async () => {
    if (isListening) return console.error(`⚡️ [AIMS]: Fastify is already listening on port '${Util.env.FASTIFY_PORT}'`);
    isListening = true;

    const options = { logger: false };
    const fastify = Fastify(options);

    fastify.register(FastifyCors);
    fastify.register(FastifyCookies);
    fastify.register(FastifySession, {
        secret: 'a secret with minimum length of 32 characters',
        cookie : {
            path : '/',
            httpOnly : true,
            secure : false,
        },
    });

    fastify.addHook('preHandler', (request:FastifyRequest, reply:FastifyReply, next) => {
        console.log(request.session.cookie)
        next();
    });
    
    fastify.register(FastifyMultipart, {
        limits: {
            fieldNameSize: 100, // Max field name size in bytes
            fieldSize: 100,     // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 1000000,  // For multipart forms, the max file size in bytes
            files: 10,          // Max number of file fields
            headerPairs: 100    // Max number of header key=>value pairs
        }
    });

    fastify.register(v1, { prefix : `${Util.env.BASEHREF}/api/v1` });
    
    fastify.listen({ port: Util.env.FASTIFY_PORT }, (error) => {
        if (error) return console.error(`\n\n${error}\n\n⚡️ [AIMS]: Fastify failed to listen to port '${Util.env.FASTIFY_PORT}'`);
        console.log(`⚡️ [AIMS]: Fastify Server is running at 'http://localhost:${Util.env.FASTIFY_PORT}${Util.env.BASEHREF}/api'`);
    });
}