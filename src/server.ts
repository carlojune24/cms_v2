import Fastify from "fastify";
import fs from "fs";
import path from "path";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import { systemDB } from "./schema/system_schema"
import { system_routes } from "./routes/protected_routes";
import { pre_auth_route } from "./routes/pre_auth_route";

const myLogger = require("./logger");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const main = async() => {
    
    try{
        const fastify: any = Fastify({
            logger : new myLogger(),
            disableRequestLogging : true,
            http2 : true,
            https : {
                allowHTTP1: true,
                key: fs.readFileSync(path.join(__dirname,"./ssl/self-signed.key")),
                cert: fs.readFileSync(path.join(__dirname,"./ssl/self-signed.crt"))
            },
            
        })

        await fastify.register(cors);
        await fastify.register(cookie);
        await fastify.register(session, {
            secret: "you can actually connect with ease",
            cookie: {
                path: "/cms_v2/api",
                httpOnly: true,
                secure: false
            }
        });

        // const mongodb:any = await database.connect()
        const system_db:any = await systemDB.connect()
        // if(!mongodb) throw new Error("Error connecting to mongodb")
        if(!system_db) throw new Error("Error connecting to mongodb")

        fastify.log.info("Successfully connected to mongodb")
        fastify.decorateRequest('models', { getter: () =>  system_db.models })

        await fastify.register(pre_auth_route, {prefix: '/cms_v2/api'})

        await fastify.register(require('@fastify/static'),{
            root:path.join(__dirname, 'candidates'),
            prefix: '/cms_v2/api/profile/candidate',
            decorateReply: false
        });

        

        fastify.register( (api:any, opts:any, done:any)=> {
            api.addHook('preHandler', async (req:any, res:any) => {
                //do something on api routes
                console.log(req.url, "url")
                if(req.session && req.session.user_id) {
                    fastify.log.info({"message": "request is authenticated"})
                }else{
                    return res.code(400).send({message:"unauthorized"});
                }
                // if (res.sent) return //stop on error (like user authentication)
            })
            api.register(system_routes)
            done()
        },{ prefix: '/cms_v2/api'})

        fastify.addHook("onResponse", (req:any, reply:any, done:any) =>{
            fastify.log.info({
                url: req.url,
                method: req.method,
                statusCode: reply.raw.statusCode,
                ip: req.ip,
                ms:reply.getResponseTime()
            },  "request completed")
            done();
        })

        fastify.addHook("onError",(req:any, reply:any, done:any, error:any) =>{
            fastify.log.error(error,"ERROR")
            reply.code(503).send(error),
            done();
        })

        fastify.listen({ port: 2023, host:'0.0.0.0' }, function (err: any, address: any) {
            if (err) {
                // console.log(err)
                process.exit(1)
            }
        })

        fastify.get("/cms_v2/api", async(request: any, reply: any)=> {
            let ratings = await system_db.models.ratings.find().populate('judge_id');
            reply.code(200).send({data: ratings});
        })
    }catch(error){
        throw error;
    }
}

main();