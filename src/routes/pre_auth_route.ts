import { access_controller } from "../controller/authentication_controller";
import { judges_controller } from "../controller/judges_controller";
import { event_controller } from "../controller/event.controller";
import { candidate_controller } from "../controller/candidate_controller";
import { round_controller } from "../controller/round_controller";
import { categories_controller } from "../controller/categories_controller";
import { rating_controller } from "../controller/rating_controller";

export async function pre_auth_route(fastify:any, opts:any, done:any) {
    fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true,
        limits: {
            fieldNameSize: 1*1024*1024, // Max field name size in bytes
            fieldSize: 2*1024*1024,     // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 40*1024*1024,  // For multipart forms, the max file size in bytes
            headerPairs: 2000,  // Max number of header key=>value pairs
            parts: 1000         // For multipart forms, the max number of parts (fields + files)
        } 
    })
     //sign in
    fastify.post('/authenticate', access_controller.authenticate);
    fastify.post('/authenticateJudge', access_controller.loginAsJudge);
    fastify.get('/check_api_session', access_controller.check_api_session);
    fastify.get('/logout', access_controller.remove_session);

    
    done()
}