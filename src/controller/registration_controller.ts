import { FastifyReply } from "fastify"
import { env } from "../environment";
import { sms_controller } from "./sms_controller";
const otpGenerator = require('otp-generator');

export const registration_controller = {
    register: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body, "body")
            if(req.body === undefined) return res.send({response: false, message: "missing body"})
            
            if(req.body && !req.body.otp) return res.code(400).send({response: false, message: "No OTP sent"})

            let find_email = await req.models.registration.findOne({email: req.body.email}).lean();
            if (find_email) return res.code(400).send({message: `${req.body.email} already existed on the database`});

            let find_number = await req.models.registration.findOne({contact_no: req.body.contact_no}).lean();
            if (find_number) return res.code(400).send({message: `Contact number: ${req.body.contact_no} already existed on the database`});

            let match_otp = await req.models.otp_model.findOne({otp: req.body.otp}).lean();
            if(match_otp) {
                let access_code = otpGenerator.generate(8, {
                    upperCaseAlphabets: true,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });

                req.body.access_code = access_code;
                let create = await req.models.registration.create(req.body)
                await req.models.otp_model.findOneAndDelete({otp: req.body.otp});
                let sms = await sms_controller.sendSMS({message: `Your access code is: ${create.access_code}, you can use this ACCESS CODE or your QR CODE to attend events of LGU of BISLIG`, contact_no: req.body.contact_no})
                console.log(sms, "sms reg")
                return res.code(200).send({data:create, message: 'Registration successful'})
            } else if (!match_otp) {
                return res.code(400).send({message: 'OTP not found pls generate another one'})
            }else {
                return res.code(400).send({message: 'An error occurred while creating'})
            }
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },

    access_code: async (req: any, res: FastifyReply) => {
        try {
            if(req.params === undefined) return res.send({response: false, message: "missing body"})
            if(req.params && !req.params.otp) return res.code(400).send({response: false, message: "No OTP sent"})
            if(req.params && !req.params.contact_no) return res.code(400).send({response: false, message: "No contact number sent"})
            let match_otp = await req.models.otp_model.findOne({otp: req.params.otp, contact_no: req.params.contact_no}).lean();
            if(match_otp) {
                let registration = await req.models.registration.findOne({contact_no: req.params.contact_no}).lean();
                await req.models.otp_model.findOneAndDelete({otp: req.params.otp});
                return res.code(200).send({data:registration})
            }
            return res.code(400).send({message: `Cannot find OTP and number. Please register`})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetch_registrations: async (req: any, res: FastifyReply) => {
        try {
            let registrations = await req.models.registration.find().lean();
            return res.code(200).send({data:registrations})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    
}