import { FastifyReply } from "fastify"
import mongoose from "mongoose";
import otpGenerator from 'otp-generator';

export const rating_controller = {
    ratingByEventID: async (req: any, res: FastifyReply) => {
        try {
            let ratings = await req.models.ratings.find({event_id: req.params.event_id});
            return res.code(200).send({data:ratings, message: 'Successfully fetched rating'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    ratingByJudgeOnEvent: async (req: any, res: FastifyReply) => {
        try {
            if(req.params.event_id === undefined) return res.code(400).send({message: `Event undefined`})
            if(req.params.judge_id === undefined) return res.code(400).send({message: `Judge  undefined`})
            let ratings = await req.models.ratings.find({event_id: new mongoose.Types.ObjectId(req.params.event_id), judge_id: new mongoose.Types.ObjectId(req.params.judge_id)})
                
            console.log(ratings, "ratings")
            return res.code(200).send({data:ratings, message: 'Successfully fetched rating'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    ratingByJudgeOnEventCategory: async (req: any, res: FastifyReply) => {
        try {
            if(req.params.judge_id === undefined) return res.code(400).send({message: `Judge  undefined`})
            if(req.params.category_id === undefined) return res.code(400).send({message: `Category  undefined`})
            let ratings = await req.models.ratings.find({category_id: new mongoose.Types.ObjectId(req.params.category_id), judge_id: new mongoose.Types.ObjectId(req.params.judge_id)})
            .populate('event_id')
            .populate('candidate_id')
            .populate('round_id')
            .populate('judge_id')
            return res.code(200).send({data:ratings, message: 'Successfully fetched rating'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    rateByCandidate: async( req:any, res:any) => {
        try {
            console.log(req.body, "body")
            let insertRating = await req.models.ratings.findOneAndUpdate({category_id: req.body.category_id, candidate_id: req.body.candidate_id, judge_id:req.body.judge_id}, req.body, {new: true, upsert: true}).lean()
            return res.code(200).send({data:insertRating, message: 'Successfully saved rating'})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    updateRateByCandidate: async( req:any, res:any) => {
        try {
            console.log(req.body, "body")
            const {_id, ...body} = req.body
            let updateRating = await req.models.ratings.findOneAndUpdate({_id: _id}, body, {new: true});
            return res.code(200).send({data:updateRating, message: 'Successfully updated rating'})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
}