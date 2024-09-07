import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";

import * as Postgres from "./Postgres";
import * as Redis from "./Redis";

export const v1 = async (fastify:FastifyInstance, _:FastifyPluginOptions, done:() => void) => {

    const database:any = await Postgres.connect();
    const session:any = await Redis.connect();
    
    fastify.all('/', (request:FastifyRequest, reply:FastifyReply) => {

    });

    fastify.get('/example', (request:FastifyRequest, reply:FastifyReply) => {
        const { result, error } = database.sample;
        if (error) return reply.code(500).send({ error });
        reply.send({ result });
    });

    fastify.get('/example/:uuid', (request:FastifyRequest, reply:FastifyReply) => {

    });

    fastify.post('/example', (request:FastifyRequest, reply:FastifyReply) => {

    });

    fastify.put('/example/:uuid', (request:FastifyRequest, reply:FastifyReply) => {

    });

    fastify.delete('/example', (request:FastifyRequest, reply:FastifyReply) => {

    });

    done();
}