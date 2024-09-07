import { FastifyReply } from "fastify";
import { env } from "../environment";
import otpGenerator from 'otp-generator';

export const sms_controller = {
    sendOtpMobile: async (req: any, res: FastifyReply) => {
        try{
            console.log(req.body)
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            let obj = {
                contact_no: req.body.contact_no,
                otp: otp,
                createdAt: new Date(),
            }

            let create_otp = await req.models.otp_model.create(obj);
            ((id:any)=>{
                setTimeout( async ()=> {
                    console.log("deleting OTP", id)
                    await req.models.otp_model.findOneAndDelete({_id: id})
                }, 180000)
            })(create_otp._id)

            console.log(create_otp.otp," otp")

            let final_data = {
                number: `+63${create_otp.contact_no}`,
                message: `LGU-BISLIG \n\nThis is your OTP: ${create_otp.otp}\nThis is an automated message, please do not reply.`
            }
            const response = await fetch(env.gsm_module_url + "/send_sms", {
                headers: {
                    'content-type': 'application/json'
                }, 
                method: 'POST',
                body: JSON.stringify(final_data)
            });
            let response_data = await response.json();
            console.log(response_data, "gi send sa gsm")
            return res.code(200).send({message: "OTP Sent successfully", otp: create_otp.otp}); 
        }catch(err){
            console.error(err) 
            return res.code(400).send({message: `Something went wrong ERROR: ${err}`})
        }
    },
    sendOtpEmail: async (req: any, res: FastifyReply) => {
        try{
            console.log(req.body)
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            let obj = {
                email: req.body.data.email,
                otp: otp,
                createdAt: new Date(),
            };

            let create_otp = await req.models.otp_model.create(obj);
            ((id) => {
                setTimeout(async () => {
                    await req.models.otp_model.findOneAndDelete(id);
                }, 180000);
            })(create_otp._id);

            let final_data = {
                message: `This is your OTP: ${create_otp.otp}`
            };

            // Send email
            const nodemailer = require('nodemailer');
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hrmo.applications@bislig.gov.ph', // Your email address
                    pass: 'hdmxieetjwrfhcgd' // Your password
                }
            });

            let mailOptions = {
                from: 'hrmo.applications@bislig.gov.ph', // Your email address
                to: req.body.data.email, // Receiver's email address
                subject: 'OTP for Verification',
                text: final_data.message
            };

            transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    console.log(error);
                    return res.code(400).send({message: `An error expectedly occured ${error}`})
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }catch(err){
            console.error(err) 
            return res.code(400).send({message: `Something went wrong ERROR: ${err}`})
        }
    },
    send_otp_signIn: async (req: any, res: FastifyReply) => {
        try {
            if(req.body.data.type == 'mobile'){
                let check_mobile_if_exist = await req.models.registered_user_model.findOne({contact_no: req.body.data.contact_no.toString()}).lean();
                if( check_mobile_if_exist ) {
                    let otp = otpGenerator.generate(6, {
                        upperCaseAlphabets: false,
                        lowerCaseAlphabets: false,
                        specialChars: false,
                    });
        
                    let obj = {
                        contact_no: req.body.data.contact_no,
                        otp: otp,
                        createdAt: new Date(),
                    }
        
                    let create_otp = await req.authModels.otp_model.create(obj);
                    ((id:any)=>{
                        setTimeout( async ()=> {
                            await req.authModels.otp_model.findOneAndDelete(id)
                        }, 180000)
                    })(create_otp._id)
        
                    console.log(create_otp.otp," otp")
        
                    let final_data = {
                        number: `+63${create_otp.contact_no}`,
                        message: `LGU-BISLIG HRMO\n\nThis is your OTP: ${create_otp.otp}\nThis is an automated message, please do not reply.`
                    }
                    const response = await fetch(env.gsm_module_url + "/send_sms", {
                        headers: {
                            'content-type': 'application/json'
                        }, 
                        method: 'POST',
                        body: JSON.stringify(final_data)
                    });
                    let response_data = await response.json();
                    console.log(response_data, "gi send sa gsm")
                    return res.code(200).send({message: "OTP Sent successfully"});
                } else {
                    return res.code(400).send({message: "Contact no used is not yet registered."});
                }
            } else {
                let check_email_if_exist = await req.models.registered_user_model.findOne({email: req.body.data.email}).lean();
                if( check_email_if_exist ) {
                    let otp = otpGenerator.generate(6, {
                        upperCaseAlphabets: false,
                        lowerCaseAlphabets: false,
                        specialChars: false,
                    });
        
                    let obj = {
                        email: req.body.data.email,
                        otp: otp,
                        createdAt: new Date(),
                    };
        
                    let create_otp = await req.authModels.otp_model.create(obj);
                    ((id) => {
                        setTimeout(async () => {
                            await req.authModels.otp_model.findOneAndDelete(id);
                        }, 180000);
                    })(create_otp._id);
        
                    let final_data = {
                        message: `This is your OTP: ${create_otp.otp}`
                    };
        
                    // Send email
                    const nodemailer = require('nodemailer');
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'hrmo.applications@bislig.gov.ph', // Your email address
                            pass: 'hdmxieetjwrfhcgd' // Your password
                        }
                    });
        
                    let mailOptions = {
                        from: 'hrmo.applications@bislig.gov.ph', // Your email address
                        to: req.body.data.email, // Receiver's email address
                        subject: 'OTP for Verification',
                        text: final_data.message
                    };
        
                    transporter.sendMail(mailOptions, (error: any, info: any) => {
                        if (error) {
                            console.log(error);
                            return res.code(400).send({message: `An error expectedly occured ${error}`})
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                } else {
                    return res.code(400).send({message: "Email used is not yet registered."});
                }
            }
        } catch(err){
            console.error(err) 
            return res.code(400).send({message: `Something went wrong ERROR: ${err}`})
        }
    },
    test: async (req: any, res: FastifyReply) => {
        try{
            const response = await fetch(env.gsm_module_url + "/test", {
                headers: {
                    'content-type': 'application/json'
                }, 
                method: 'GET'
            });
            const data = await response.json()
            return res.code(200).send({data});
        }catch(err){
            console.error(err) 
            return res.code(400).send({message: `Something went wrong ERROR: ${err}`})
        }
    },
    sendSMS:async (data:{ message:string, contact_no: string}) => {
        let final_data = {
            number: `+63${data.contact_no}`,
            message: data.message
        }
        const response = await fetch(env.gsm_module_url + "/send_sms", {
            headers: {
                'content-type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(final_data)
        });
        let response_data = await response.json();
        console.log(response_data, "gi send sa gsm")
        return response_data
    }
}