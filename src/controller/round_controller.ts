import { FastifyReply } from "fastify"
import otpGenerator from 'otp-generator';

export const round_controller = {
    createRound: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body)
            let round = await req.models.rounds.create(req.body);
            return res.code(200).send({data:round, message: 'Successfully created round'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchAllRoundsByEventID: async(req:any, res: any) => {
        try {
            let rounds = await req.models.rounds.find({event_id: req.params.event_id}).populate('candidates.candidate_id').lean()
            return res.code(200).send({data:rounds})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    updateRound: async (req: any, res: FastifyReply) => {
        try{
            const {round_id, ...body} = req.body
            console.log(req.body)
            let update = await req.models.rounds.findOneAndUpdate({_id: round_id}, body, {new: true})
            console.log(update, "update")
            return res.code(200).send({data:update, message: "Successfully updated round"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    addDeductionInRoundCandidate : async (req: any, res: FastifyReply) => {
        try{
            const {round_id, ...body} = req.body
            console.log(req.body)
            let updateCandidate = await req.models.rounds.findOneAndUpdate({_id: round_id, 'candidates.candidate_id': body.candidate_id}, 
                {
                    "candidates.$.deductions" : req.body.deductions
                },
                {
                    new: true
                }
            )
            return res.code(200).send({data:updateCandidate, message: "Successfully update candidate deductions"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },

    AddRemoveCandidateInRound: async (req: any, res: FastifyReply) => {
        try{
            const {round_id, insert, ...body} = req.body
            console.log(req.body)
            // let findIfCandidateExistInRound = await req.models.round.findOne({_id: _id, "candidates.candidate_id": body.candidate_id})
            if(insert) {
                let insertCandidate = await req.models.rounds.findOneAndUpdate({_id: round_id}, 
                    {
                        "$addToSet":{
                            candidates: {"candidate_id": body.candidate_id, "deductions": []}
                        },
                    },
                    {
                        new: true
                    }
                )
                return res.code(200).send({data:insertCandidate, message: "Successfully inserted candidate in round"})
            }else{
                let deleteCandidateInRound = await req.models.rounds.findOneAndUpdate({_id: round_id}, 
                    {
                        "$pull":{
                            candidates: {"candidate_id": body.candidate_id}
                        },
                    },
                    {
                        new: true
                    }
                )
                return res.code(200).send({data:deleteCandidateInRound, message: "Successfully removed candidate in round"})
            }
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    deleteRound: async (req: any, res: FastifyReply) => {
        try{
            let del = await req.models.rounds.findOneAndDelete({_id: req.params.round_id})
            return res.code(200).send({data:del,  message: "Successfully deleted round"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    
}