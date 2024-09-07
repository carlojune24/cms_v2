import { FastifyReply } from "fastify"
import { env } from "../environment";
const otpGenerator = require('otp-generator');

import sha256 from "sha256"
import crypto from 'crypto-js'


export const access_controller = {
    authenticate : async (req:any, reply:any) => {
        try {
            Object.assign(req.body, {client_ip: req.ip, method: req.method, path: req.url })
            const main_data = {
                service_id: env.service_id,
                signature: sha256(req.body + env.service_key),
                request: req.body
            }
            const response = await fetch(env.authUrl + "/authentication", {headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify(main_data)});
            const data = await response.json();
            data.result === true ? (req.session.user_id = data.user_id, req.session.user_key = data.user_key, req.session.ip = req.ip) : console.log("not authorized");
            req.log.debug(`BODY: ${JSON.stringify(req.body)} ONEAUTHDATA: ${JSON.stringify(data)}`, "check oneauth data")
            req.log.info(`IN SESSION: IP(${req.ip}) | USER_KEY(${data?.user_key}) `)
            reply.send({response: data})
        } catch (error) {
            throw new Error(`ERROR: ${error}`)
        }
    },
    check_api_session: async (req:any, reply:any) => {
        // req.log.info(`CHECKING USER SESSION: IP(${req.ip}) USER_KEY(${req.session.user_key}) USER_ID(${req.session.user_id})`)
        if(!req.session.user_id) return reply.send({result:false})
        return reply.send({result: true})
    },
    remove_session : async (req:any, reply:any) => {
        console.log(req.session, "session")
        if(!req.session.user_id) return reply.send({result:false})
        req.log.info(`DESTROYING USER SESSION: IP(${req.ip}) USER_KEY(${req.session.user_key}) USER_ID(${req.session.user_id})`)
        req.session.destroy()
        return reply.send({result: true})
    }
}
