import { FastifyReply } from "fastify"
import mongoose from "mongoose";
import path from "path"
const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)


export const candidate_controller = {
    createCandidate: async (req: any, res: FastifyReply) => {
        try {
            if(!req.body) return res.code(400).send({message: "No body passed"})
            console.log(req.body, "body")
            
            let createCandidate = await req.models.candidates.create({name: req.body.name.value, event_id: req.body.event_id.value});
            if(createCandidate) {
                if(req.body && req.body.image.value == 'undefined') return res.code(200).send({data: createCandidate, result: true, message: 'Successfully create candidate'})
                await pump(req.body.image.toBuffer(), fs.createWriteStream(`src/candidates/${createCandidate._id}.jpg`));
                return res.code(200).send({data: createCandidate, result: true, message: 'Successfully created candidate with image'})
            }else{
                return res.code(400).send({message:`Something went wrong with saving candidate or uploading candidate image`})
            }
        } catch (err) {
            console.log(err)
            return res.code(400).send({message:`Something went wrong ERROR: ${err}`})
        }
    },
    updateCandidate: async (req: any, res: FastifyReply) => {
        try {
            if(!req.body) return res.code(400).send({message: "No body passed"})
            console.log(req.body, "body")
            
            let updateCandidate = await req.models.candidates.findOneAndUpdate({_id: req.body.candidate_id.value},{name: req.body.name.value}, {new: true});
            if(updateCandidate) {
                if(req.body && req.body.image.value == 'undefined') return res.code(200).send({data: updateCandidate, result: true, message: 'Successfully updated candidate'})
                await pump(req.body.image.toBuffer(), fs.createWriteStream(`src/candidates/${updateCandidate._id}.jpg`));
                return res.code(200).send({data: updateCandidate, result: true, message: 'Successfully updated candidate with image'})
            }else{
                return res.code(400).send({message:`Something went wrong with saving candidate or uploading candidate image`})
            }
        } catch (err) {
            console.log(err)
            return res.code(400).send({message:`Something went wrong ERROR: ${err}`})
        }
    },
    deleteCandidate: async (req: any, res: FastifyReply) => {
        try{
            let del = await req.models.candidates.findOneAndDelete({_id: req.params.candidate_id})
            if(del) {
                try {
                    await fs.unlinkSync(path.join(__dirname, '..', 'candidate', del._id + ".jpg"))
                    return res.code(200).send({data:del, message: "Candidate removed successfully"})
                } catch (error) {
                    return res.code(200).send({message: "The deletion was successful in the database, but the removal of the photo failed due to its non-existence in the directory."})
                }
            } else {
                return res.code(400).send({message: "Not deleted in Database"})
            }
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchAllCandidatesByEventID: async(req:any, res: any) => {
        try {
            let events = await req.models.candidates.find({event_id: req.params.event_id}).lean()
            return res.code(200).send({data:events})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
}