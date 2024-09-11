import { FastifyReply } from "fastify"
import otpGenerator from 'otp-generator';

export const judges_controller = {
    createJudge: async (req: any, res: FastifyReply) => {
        try {
            let access_code = otpGenerator.generate(8, {
                upperCaseAlphabets: true,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            req.body.access_code = access_code
            let event = await req.models.judges.create(req.body);
            return res.code(200).send({data:event, message: 'Successfully created judge'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchAll: async(req:any, res: any) => {
        try {
            let judges = await req.models.judges.find().lean()
            return res.code(200).send({data:judges})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    updateJudge: async (req: any, res: FastifyReply) => {
        try{
            const {_id, ...body} = req.body
            console.log(req.body)
            let update = await req.models.judges.findOneAndUpdate({_id: req.body._id}, body, {new: true})
            return res.code(200).send({data:update, message: "Successfully updated judge"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    deleteJudge: async (req: any, res: FastifyReply) => {
        try{
            let del = await req.models.judges.findOneAndDelete({_id: req.params.judge_id})
            return res.code(200).send({data:del,  message: "Successfully deleted judge"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    
}