import { FastifyReply } from "fastify"
import mongoose from "mongoose";

export const config_controller = {
    organizations: async (req: any, res: FastifyReply) => {
        try {
            let organizations = await req.models.organization.find().lean();
            console.log(organizations, ":org")
            return res.code(200).send({data:organizations, message: 'Organizations retreived'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
            
    },
    participation_types: async (req: any, res: FastifyReply) => {
        try {
            let participation_types = await req.models.participation_type.find().lean();
            return res.code(200).send({data:participation_types, message: 'Participation types retreived'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },

    event: {
        createEvent: async (req: any, res: FastifyReply) => {
            try {
                let event = await req.models.events.create(req.body);
                return res.code(200).send({data:event, message: 'Successfully created event'})
            } catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        fetchAll: async(req:any, res: any) => {
            try {
                let events = await req.models.events.find().lean()
                return res.code(200).send({data:events})
            } catch (error) {
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        updateEvent: async (req: any, res: FastifyReply) => {
            try{
                const {_id, ...body} = req.body
                let update = await req.models.events.findOneAndUpdate({_id: req.body._id}, req.body, {new: true})
                return res.code(200).send({data:update})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },

        activeEvent: async (req: any, res: FastifyReply) => {
            try{
                await req.models.events.updateMany({active: false});
                let activeEvent = await req.models.events.findOneAndUpdate({_id: req.body.event_id}, {active: req.body.active}, {new: true})
                return res.code(200).send({data:activeEvent})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        deleteEvent: async (req: any, res: FastifyReply) => {
            try{
                let del = await req.models.events.findOneAndDelete({_id: req.params.event_id})
                return res.code(200).send({data:del})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        udpateEventAttendanceType:async (req: any, res: FastifyReply) => {
            try{
                console.log(req.body, "body")
                let update = await req.models.events.findOneAndUpdate(
                    {_id: req.body.event_id, "attendance_types._id": new mongoose.Types.ObjectId(req.body.attendance_type_id)}, 
                    {
                        "$set":{
                            "attendance_types.$.name": req.body.name
                        }
                    }, 
                    {new: true}
                )

                console.log(update, "update")
                return res.code(200).send({data:update})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        addEventAttendanceType:async (req: any, res: FastifyReply) => {
            try{
                console.log(req.body)
                let update = await req.models.events.findOneAndUpdate(
                    {_id: req.body.event_id}, 
                    {
                        "$addToSet":{
                            attendance_types: {"name": req.body.name}
                        }
                    }, 
                    {new: true}
                )
                return res.code(200).send({data:update})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
        removeEventAttendanceType:async (req: any, res: FastifyReply) => {
            try{
                console.log(req.body, "body")
                let update = await req.models.events.findOneAndUpdate(
                    {_id: req.body.event_id}, 
                    { "$pull": { attendance_types: { _id: new mongoose.Types.ObjectId(req.body.attendance_type_id)} } },
                    { new: true },
                )

                console.log(update, "update")
                return res.code(200).send({data:update})
            }catch (error){
                console.log(error)
                return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
            }
        },
    }
}