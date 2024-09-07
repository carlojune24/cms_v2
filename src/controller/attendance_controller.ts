import { FastifyReply } from "fastify"
import mongoose from "mongoose";

export const attendance_controller = {
    attendance_by_id: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body)
            let registration = await req.models.registration.findOne({_id: req.body.registration_id});
            console.log(registration, ":reg")
            if(registration) {
                let attended = await req.models.attendance.findOne({registration_id: req.body.registration_id, event_id: req.body.event_id});
                if(attended) {
                    let update_attend = await req.models.attendance.findOneAndUpdate({registration_id: req.body.registration_id}, 
                        {
                            "$addToSet":{
                                attendance_log: {"attendance_type_id": req.body.attendance_type_id, date_time: new Date()}
                            },
                        },
                        {
                            new: true
                        }
                    ).populate('registration_id');
                    return res.code(200).send({data:update_attend, message: 'Successfully attended event'})
                }else{
                    req.body.attendance_log = [{"attendance_type_id": req.body.attendance_type_id, date_time: new Date()}]
                    delete req.body.attendance_type_id;
                    console.log(req.body, "here")
                    let attend = await req.models.attendance.create(req.body)
                    await attend.populate('registration_id')
                    return res.code(200).send({data:attend, message: 'Successfully attended event'})
                }
                
            }else{
                return res.code(400).send({message: 'QR ID not found'})
            }
            
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
            
    },
    attendance_by_access_code: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body)
            let attendance = await req.models.attendance.create(req.body)
            return res.code(200).send({data:attendance, message: 'Organizations retreived'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
            
    },
    attendances_by_event: async (req: any, res: FastifyReply) => {
        try {
            let attendances = await req.models.attendance.find({event_id: req.params.event_id}).populate("registration_id")
            return res.code(200).send({data:attendances, message: 'attendances retreived'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
            
    },
}