import { FastifyReply } from "fastify"
import mongoose from "mongoose";

export const event_controller = {
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
    fetchEvent: async(req:any, res: any) => {
        try {
            let event = await req.models.events.findOne({_id: req.params.event_id}).lean()
            return res.code(200).send({data:event})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchJudges: async(req:any, res: any) => {
        try {
            let event = await req.models.judges.find({"events.event_id": req.params.event_id}, {'events.$' : 1, name: 1}).populate('events.event_id').lean()
            return res.code(200).send({data:event})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },

    updateEvent: async (req: any, res: FastifyReply) => {
        try{
            // console.log()
            const {_id, ...body} = req.body
            let update = await req.models.events.findOneAndUpdate({_id: req.body._id}, body, {new: true})
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
}