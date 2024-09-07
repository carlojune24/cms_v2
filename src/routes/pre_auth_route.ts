import { access_controller } from "../controller/authentication_controller";
import { sms_controller } from "../controller/sms_controller";
import { registration_controller } from "../controller/registration_controller";
import { config_controller } from "../controller/config_controller";

export async function pre_auth_route(fastify:any, opts:any, done:any) {
    //registration
    fastify.post('/register', registration_controller.register);
    fastify.get('/access_code/:contact_no/:otp', registration_controller.access_code);

    // config
    fastify.get('/organizations', config_controller.organizations);
    fastify.get('/participation_types', config_controller.participation_types);
    
    //sign in
    fastify.post('/authenticate', access_controller.authenticate);
    fastify.get('/check_api_session', access_controller.check_api_session);
    fastify.get('/logout', access_controller.remove_session);

    //otp
    fastify.post('/req_otp_mobile', sms_controller.sendOtpMobile);
    fastify.get('/sendOtp', sms_controller.test);
    done()
}