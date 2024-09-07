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
                path: "/qr-registration/api",
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
        // fastify.decorateRequest('models', { getter: () =>  mongodb.models })

        // await fastify.register(require('@fastify/static'),{
        //     root:path.join(__dirname, 'upload/profiles'),
        //     prefix: '/rspms-registration/api/upload/profiles/',
        //     decorateReply: false
        // })

        let data:any = [
            {
                "registration_id": "66cfdc585548ce2dde8d89c3",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:45.681Z"
            },
            {
                "registration_id": "66cfdaee5548ce2dde8d8963",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:27.361Z"
            },
            {
                "registration_id": "66cfe2455548ce2dde8d8ab9",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:27.336Z"
            },
            {
                "registration_id": "66d7a761d3daa7865363eb5b",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:00.301Z"
            },
            {
                "registration_id": "66cfe7aa5548ce2dde8d8c1a",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:30.216Z"
            },
            {
                "registration_id": "66d72c64d3daa7865363e4f9",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:28.660Z"
            },
            {
                "registration_id": "66d29bae5548ce2dde8d9422",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:29.242Z"
            },
            {
                "registration_id": "66cfcf705548ce2dde8d87ef",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:06.559Z"
            },
            {
                "registration_id": "66d2722a5548ce2dde8d9417",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:24.442Z"
            },
            {
                "registration_id": "66d132c55548ce2dde8d90c7",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:22.198Z"
            },
            {
                "registration_id": "66cfe4de5548ce2dde8d8b69",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:34.205Z"
            },
            {
                "registration_id": "66d117965548ce2dde8d9026",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:06.810Z"
            },
            {
                "registration_id": "66cfd2775548ce2dde8d8895",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:22.717Z"
            },
            {
                "registration_id": "66cfd0025548ce2dde8d8823",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:19.971Z"
            },
            {
                "registration_id": "66cff5505548ce2dde8d8d5a",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:08.806Z"
            },
            {
                "registration_id": "66cfe36a5548ce2dde8d8b05",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:44.211Z"
            },
            {
                "registration_id": "66cfe4425548ce2dde8d8b46",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:19.318Z"
            },
            {
                "registration_id": "66d10d755548ce2dde8d8fc0",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:17.474Z"
            },
            {
                "registration_id": "66cfd0f05548ce2dde8d8850",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:54.789Z"
            },
            {
                "registration_id": "66cfe5415548ce2dde8d8b88",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:09.082Z"
            },
            {
                "registration_id": "66cfe4835548ce2dde8d8b57",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:58.870Z"
            },
            {
                "registration_id": "66cffa805548ce2dde8d8d93",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:24.587Z"
            },
            {
                "registration_id": "66d7117bd3daa7865363e408",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:27.844Z"
            },
            {
                "registration_id": "66d018a35548ce2dde8d8eed",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:02.952Z"
            },
            {
                "registration_id": "66d1efb95548ce2dde8d93bc",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:21.375Z"
            },
            {
                "registration_id": "66cff1265548ce2dde8d8d15",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:21.089Z"
            },
            {
                "registration_id": "66cfcfcf5548ce2dde8d8814",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:31.586Z"
            },
            {
                "registration_id": "66cfe9215548ce2dde8d8c51",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:31.520Z"
            },
            {
                "registration_id": "66d6f7c2d3daa7865363e231",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:24.411Z"
            },
            {
                "registration_id": "66d003a75548ce2dde8d8e1d",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:45.448Z"
            },
            {
                "registration_id": "66cfdf855548ce2dde8d8a3d",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:28.396Z"
            },
            {
                "registration_id": "66cfde4d5548ce2dde8d8a11",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:43.770Z"
            },
            {
                "registration_id": "66d011c35548ce2dde8d8ecc",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:14.475Z"
            },
            {
                "registration_id": "66d00eda5548ce2dde8d8eba",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:12.776Z"
            },
            {
                "registration_id": "66cfe1b85548ce2dde8d8a9d",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:31.612Z"
            },
            {
                "registration_id": "66d78132d3daa7865363e52f",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:40.078Z"
            },
            {
                "registration_id": "66cfe82e5548ce2dde8d8c3a",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:14.491Z"
            },
            {
                "registration_id": "66d573f83467b8f0e3358816",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:41.625Z"
            },
            {
                "registration_id": "66d004ea5548ce2dde8d8e43",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:16.588Z"
            },
            {
                "registration_id": "66cff8015548ce2dde8d8d6c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:49.627Z"
            },
            {
                "registration_id": "66d00b3b5548ce2dde8d8ea1",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:59.236Z"
            },
            {
                "registration_id": "66d14cd85548ce2dde8d9195",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:53.084Z"
            },
            {
                "registration_id": "66cfd5f25548ce2dde8d8901",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:22.877Z"
            },
            {
                "registration_id": "66cff3be5548ce2dde8d8d38",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:56.486Z"
            },
            {
                "registration_id": "66d25f755548ce2dde8d93eb",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:12.215Z"
            },
            {
                "registration_id": "66cfeae75548ce2dde8d8c7f",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:20.017Z"
            },
            {
                "registration_id": "66d6fd5ed3daa7865363e330",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:26.200Z"
            },
            {
                "registration_id": "66d79c98d3daa7865363e8da",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:30.100Z"
            },
            {
                "registration_id": "66d56b973467b8f0e3358808",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:18.316Z"
            },
            {
                "registration_id": "66d193a15548ce2dde8d92f0",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:41.766Z"
            },
            {
                "registration_id": "66d569893467b8f0e33587e8",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:51.583Z"
            },
            {
                "registration_id": "66d57ecfe2e1294a42cf0f08",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:10.457Z"
            },
            {
                "registration_id": "66d04fe75548ce2dde8d8f3c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:21.960Z"
            },
            {
                "registration_id": "66d593fae2e1294a42cf0f5f",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:29.823Z"
            },
            {
                "registration_id": "66d70071d3daa7865363e3a4",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:56.661Z"
            },
            {
                "registration_id": "66d707e0d3daa7865363e3fb",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:22.912Z"
            },
            {
                "registration_id": "66d7a976d3daa7865363f6d4",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:47.406Z"
            },
            {
                "registration_id": "66cfea885548ce2dde8d8c74",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:17.318Z"
            },
            {
                "registration_id": "66d6fb1cd3daa7865363e2bb",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:19.524Z"
            },
            {
                "registration_id": "66d6d780d3daa7865363e21b",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:49.111Z"
            },
            {
                "registration_id": "66d57bede2e1294a42cf0e4e",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:58.440Z"
            },
            {
                "registration_id": "66d57d5ce2e1294a42cf0ea8",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:52.901Z"
            },
            {
                "registration_id": "66d0088a5548ce2dde8d8e76",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:43.326Z"
            },
            {
                "registration_id": "66d56b753467b8f0e3358802",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:01.723Z"
            },
            {
                "registration_id": "66cfe5215548ce2dde8d8b7e",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:53.891Z"
            },
            {
                "registration_id": "66d70517d3daa7865363e3e5",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:43.713Z"
            },
            {
                "registration_id": "66d7aa0ad3daa7865363f88f",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:45.206Z"
            },
            {
                "registration_id": "66d1bc8b5548ce2dde8d9348",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:03.127Z"
            },
            {
                "registration_id": "66d7a9bad3daa7865363f760",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:14.524Z"
            },
            {
                "registration_id": "66d7a52ed3daa7865363eaac",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:41.783Z"
            },
            {
                "registration_id": "66d71490d3daa7865363e438",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:51.332Z"
            },
            {
                "registration_id": "66d7aad0d3daa7865363fa23",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:26.154Z"
            },
            {
                "registration_id": "66d79366d3daa7865363e69f",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:54.931Z"
            },
            {
                "registration_id": "66d79324d3daa7865363e68d",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:42.071Z"
            },
            {
                "registration_id": "66d78db2d3daa7865363e56c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:11.427Z"
            },
            {
                "registration_id": "66d144195548ce2dde8d9163",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:23.239Z"
            },
            {
                "registration_id": "66d7a95ed3daa7865363f6a4",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:42.132Z"
            },
            {
                "registration_id": "66d7abcbd3daa7865363fd14",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:11.625Z"
            },
            {
                "registration_id": "66d7ab00d3daa7865363fa92",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:05.065Z"
            },
            {
                "registration_id": "66cfe5845548ce2dde8d8b96",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:01.022Z"
            },
            {
                "registration_id": "66d7abcfd3daa7865363fd20",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:38.561Z"
            },
            {
                "registration_id": "66d79cc1d3daa7865363e8e8",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:53.175Z"
            },
            {
                "registration_id": "66d7ac5fd3daa7865363fe86",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:23.804Z"
            },
            {
                "registration_id": "66d6bab1d3daa7865363defb",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:51.337Z"
            },
            {
                "registration_id": "66d7ac74d3daa7865363fea2",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:55.890Z"
            },
            {
                "registration_id": "66d79596d3daa7865363e739",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:17.770Z"
            },
            {
                "registration_id": "66d79f12d3daa7865363e96c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:26.872Z"
            },
            {
                "registration_id": "66d7a3f2d3daa7865363ea29",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:25.624Z"
            },
            {
                "registration_id": "66d79a55d3daa7865363e856",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:24.669Z"
            },
            {
                "registration_id": "66d7927fd3daa7865363e635",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:09.348Z"
            },
            {
                "registration_id": "66d7927ed3daa7865363e629",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:13.855Z"
            },
            {
                "registration_id": "66d726f7d3daa7865363e4c2",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:17.594Z"
            },
            {
                "registration_id": "66d7ad00d3daa7865363ffb5",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:29.891Z"
            },
            {
                "registration_id": "66d7ac74d3daa7865363feb0",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:40.046Z"
            },
            {
                "registration_id": "66d6fae3d3daa7865363e2a1",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:07.930Z"
            },
            {
                "registration_id": "66d7ad08d3daa7865363ffc2",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:49.648Z"
            },
            {
                "registration_id": "66d7a9fbd3daa7865363f868",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:09.737Z"
            },
            {
                "registration_id": "66d7a85fd3daa7865363ee0a",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:10.503Z"
            },
            {
                "registration_id": "66d79ab4d3daa7865363e866",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:40.252Z"
            },
            {
                "registration_id": "66d003bd5548ce2dde8d8e23",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:15.641Z"
            },
            {
                "registration_id": "66cfcfae5548ce2dde8d8804",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:00.590Z"
            },
            {
                "registration_id": "66d79af1d3daa7865363e87e",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:02.296Z"
            },
            {
                "registration_id": "66cfd2275548ce2dde8d8885",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:04.991Z"
            },
            {
                "registration_id": "66d6ff01d3daa7865363e370",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:13.113Z"
            },
            {
                "registration_id": "66d7b2b0d3daa78653640a95",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:36.992Z"
            },
            {
                "registration_id": "66d7b349d3daa78653640b01",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:03.139Z"
            },
            {
                "registration_id": "66d7b4a6d3daa78653640c19",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:47.822Z"
            },
            {
                "registration_id": "66d7b168d3daa78653640625",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:54:34.874Z"
            },
            {
                "registration_id": "66d7b2f4d3daa78653640ab6",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:48:53.305Z"
            },
            {
                "registration_id": "66d7b594d3daa78653640c8c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:08.706Z"
            },
            {
                "registration_id": "66d7b5c3d3daa78653640c9c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:42.438Z"
            },
            {
                "registration_id": "66d7b590d3daa78653640c84",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:46:38.431Z"
            },
            {
                "registration_id": "66d7b5eed3daa78653640cb7",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:49:46.120Z"
            },
            {
                "registration_id": "66d549323467b8f0e33587b8",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:12.680Z"
            },
            {
                "registration_id": "66d7b7d6d3daa78653640d2c",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:04.857Z"
            },
            {
                "registration_id": "66d79e4cd3daa7865363e93e",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:32.494Z"
            },
            {
                "registration_id": "66d79da2d3daa7865363e920",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:51:35.900Z"
            },
            {
                "registration_id": "66d7bab4d3daa78653641557",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:54:05.184Z"
            },
            {
                "registration_id": "66d6fb41d3daa7865363e2cc",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:53:45.968Z"
            },
            {
                "registration_id": "66d6fa62d3daa7865363e27b",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:52:37.025Z"
            },
            {
                "registration_id": "66d7c4e2d3daa786536425e5",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:50:45.325Z"
            },
            {
                "registration_id": "66d5c42be2e1294a42cf1035",
                "event_id": "66d8f5a6d3daa786536511e9",
                "attendance_type_id": "66d8f5a6d3daa786536511eb",
                "date_time": "2024-09-05T03:47:35.824Z"
            }
        ]

        data.forEach( async(item:any)=> {
            console.log(item, "item")
            let attended = await system_db.models.attendance.findOne({registration_id: item.registration_id, event_id: item.event_id});
                if(attended) {
                    let update_attend = await system_db.models.attendance.findOneAndUpdate({registration_id: item.registration_id, event_id: item.event_id}, 
                        {
                            "$addToSet":{
                                attendance_log: {"attendance_type_id": item.attendance_type_id, date_time: item.date_time}
                            },
                        },
                        {
                            new: true
                        }
                    ).populate('registration_id');
                    console.log("UDPATE:", update_attend)
                }else{
                    item.attendance_log = [{"attendance_type_id": system_db.body.attendance_type_id, date_time: new Date()}]
                    let attend = await system_db.models.attendance.create(item)
                    console.log("INSERT:", attend)
                }
        })

        await fastify.register(pre_auth_route, {prefix: '/qr-registration/api'})

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
        },{ prefix: '/qr-registration/api'})

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

        fastify.get("/qr-registration/api", function (request: any, reply: any) {
            console.log("processing request")
            reply.code(200).send({hey:"you're almost there"});
        })

        fastify.listen({ port: 2022, host:'0.0.0.0' }, function (err: any, address: any) {
            if (err) {
                // console.log(err)
                process.exit(1)
            }
        })
    }catch(error){
        throw error;
    }
}

main();