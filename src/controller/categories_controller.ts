import { FastifyReply } from "fastify"
import otpGenerator from 'otp-generator';

export const categories_controller = {
    createCatergory: async (req: any, res: FastifyReply) => {
        try {
            let category = await req.models.categories.create(req.body);
            await category.populate('round_id')
            return res.code(200).send({data:category, message: 'Successfully created category'})
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchCategoryByRoundID: async(req:any, res: any) => {
        try {
            let categoryByRoundID = await req.models.categories.find({round_id: req.params.round_id}).lean()
            return res.code(200).send({data:categoryByRoundID})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchCategoryByEventID: async(req:any, res: any) => {
        try {
            let categoryByEventID = await req.models.categories.find({event_id: req.params.event_id}).populate('round_id').lean()
            return res.code(200).send({data:categoryByEventID})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    updateCategory: async (req: any, res: FastifyReply) => {
        try{
            const {category_id, ...body} = req.body
            let update = await req.models.categories.findOneAndUpdate({_id: category_id}, body, {new: true}).populate('round_id')
            return res.code(200).send({data:update, message: "Successfully updated category"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    deleteCategory: async (req: any, res: FastifyReply) => {
        try{
            let del = await req.models.categories.findOneAndDelete({_id: req.params.categories})
            return res.code(200).send({data:del,  message: "Successfully deleted judge"})
        }catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    
}