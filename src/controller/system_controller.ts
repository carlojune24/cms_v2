import { FastifyReply } from "fastify"
import mongoose from "mongoose"
import path from "path"
const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)


export const upload_attachment_controller = {
    create: async (req: any, res: FastifyReply, fastify: any) => {
        try {
            console.log(req.body, "body")
            if(!req.body) return res.code(400).send({message: "No body passed"})
            const keys = Object.keys(req.body);
            for(let i = 0; i < keys.length; i++) {
                if(req.body[keys[i]].file) {
                    let type =  req.body[keys[i]].filename.split(".")
                    let obj = {
                        application_id: req.body._id.value,
                        document_name: req.body[keys[i]].fieldname,
                        file_type: type.at(-1)
                    }
                    let create = await req.models.application_attachment_model.create(obj);
                    console.log(obj, "obj")
                    console.log(create, "Created attachment")
                    if(create) {
                        await pump(req.body[keys[i]].toBuffer(), fs.createWriteStream(`src/upload/attachments/${create._id}.${type.at(-1)}`))
                    } else {
                        console.log("error creating attachment")
                        await req.models.application_attachment_model.findByIdAndDelete({_id: create._id})
                    }
                }
            }
            let attachments = await req.models.application_attachment_model.find({application_id: req.body._id.value})
            return res.code(200).send({data:attachments, result: true, message: 'Attachment uploaded successfully'})
        } catch (err) {
            console.log(err)
            return res.code(400).send({message:`Something went wrong ERROR: ${err}`})
        }
    },
    delete: async (req: any, res: FastifyReply, fastify: any) => {
        // try {
            if(!req.params._id) {
                console.log('a')
                return res.send({message: "No Id passed", response: false})
            }
            if(!mongoose.isValidObjectId(req.params._id)){
                console.log('b')
                return res.send({response: false, message: "is not a valid objectId"})
            }
            let remove = await req.models.application_attachment_model.findByIdAndDelete({_id: req.params._id})
            console.log(1)
            if(remove) {
                console.log(2)
                var photo_id = remove._id; 
                // console.log(photo_id);
                // console.log(__dirname)
                // console.log(path.join(__dirname, '..', 'upload', 'attachments', photo_id + ".jpeg"))
                try {
                    await fs.unlinkSync(path.join(__dirname, '..', 'upload', 'attachments', photo_id + "." + remove.file_type))
                    return res.code(200).send({data:remove, message: "Attachment removed successfully"})
                } catch (error) {
                    return res.code(200).send({message: "The deletion was successful in the database, but the removal of the photo failed due to its non-existence in the directory."})
                }
            } else {
                console.log(5)
                return res.code(400).send({message: "Not deleted in Database"})
            }
    }
}

export const upload_profile_controller = {
    update: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body, "body")
            if(!req.body) return res.code(400).send({message: "No body passed"})
            await pump(req.body.profile_image.toBuffer(), fs.createWriteStream(`src/upload/profiles/${req.session.registration_id}.jpeg`))
            await req.models.registered_user_model.findOneAndUpdate({_id: req.session.registration_id}, {$set: {upload_image: true}}, {upsert: true});
            return res.code(200).send({result: true, message: 'profile uploaded successfully'})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message:`Something went wrong ERROR: ${error}`})
        }
    }
}

export const application_controller = {
    create: async (req: any, res: FastifyReply) => {
        try {
            console.log(req.body)
            if(!req.session.registration_id) return res.code(400).send({message: "not in session"})
            if(req.body === undefined) return res.send({response: false, message: "missing body"})
            req.body.work_experience.forEach( (exp:any)=> {
                if(exp.if_lgu_bislig == null || undefined) {
                    exp.if_lgu_bislig = false
                }
            })
            let findExist = await req.models.application_profile_model.findOne({registration_id: req.session.registration_id, assessment_period: req.body.assessment_period});
            if(findExist){
                console.log(findExist.approved)
                if(findExist.approved) return res.code(400).send({message: 'Cannot update application, already approved!'})
                if(!findExist.approved) {
                    findExist.registration_id = req.session.registration_id;
                    findExist.fullname = req.body.fullname;
                    findExist.birthdate = req.body.birthdate
                    findExist.contact_no = req.body.contact_no;
                    findExist.email = req.body.email;
                    findExist.civil_status = req.body.civil_status;
                    findExist.sex = req.body.sex;
                    findExist.address = req.body.address;
                    findExist.address2 = req.body.address2;
                    findExist.assessment_period = req.body.assessment_period;
                    findExist.applied_items = req.body.applied_items;
                    findExist.eligibility = req.body.eligibility;
                    findExist.education = req.body.education;
                    findExist.skills_hobbies = req.body.skills_hobbies;
                    findExist.training = req.body.training,
                    findExist.work_experience = req.body.work_experience;
                    findExist.accomplishment = req.body.accomplishment;
                    findExist.status = req.body.status;
                    await findExist.save();
                   
                    await req.models.application_item_model.deleteMany({application_id: findExist._id})

                    let remarks = (req.body.remarks ? req.body.remarks : " ");
                    req.body.applied_items.forEach(async (item: any) => {
                        let obj = {
                            registration_id: req.session.registration_id,
                            application_id: findExist._id,
                            item_id: item,
                            assessment_period: findExist.assessment_period,
                            training: findExist.training,
                            work_experience: findExist.work_experience,
                            remarks: remarks,
                            status: findExist.status,
                        }
                        let apply_item = await req.models.application_item_model.create(obj);
                        // await apply_item.populate({
                        //     path: 'item_id',
                        //     model: req.models.items_model,
                        //     populate: {
                        //         path: 'plantilla_id',
                        //         model: req.models.plantilla_model,
                        //         select: 'position'
                        //     }
                        // })

                        let logs_obj = {
                            applied_item_id: apply_item._id,
                            log: `APPLIED`,
                            user_id: req.session.registration_id
                        }
                        await req.models.application_items_logs.create(logs_obj)
                    })
                    return res.code(200).send({data:findExist, message: 'application updated successfully'})
                }
                return res.code(400).send({message: "An existing assessment period found."})
            } else {
                req.body.registration_id = req.session.registration_id;
                req.body.date_applied = Date.now();
                let create = await req.models.application_profile_model.create(req.body)
    
                let remarks = (req.body.remarks ? req.body.remarks : " ");
                req.body.applied_items.forEach(async (item: any) => {
                    let obj = {
                        registration_id: req.session.registration_id,
                        application_id: create._id,
                        item_id: item,
                        assessment_period: create.assessment_period,
                        training: create.training,
                        work_experience: create.work_experience,
                        remarks: remarks,
                        status: req.body.status,
                    }
                    let apply_item = await req.models.application_item_model.create(obj);

                    let logs_obj = {
                        applied_item_id: apply_item._id,
                        log: `APPLIED`,
                        user_id: req.session.registration_id
                    }
                    await req.models.application_items_logs.create(logs_obj)
                })
                req.log.info(`created data: ${create}`)
                return res.code(200).send({data:create, message: 'application created successfully'})
            }
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetch: async (req: any, res: FastifyReply) => {
        try {
            let fetch = await req.models.application_profile_model.find({registration_id: req.session.registration_id}).lean();
            if(fetch) {
                for (let profile of fetch) {
                    let atttachments = await req.models.application_attachment_model.find({application_id: profile._id}).lean();
                    if(atttachments.length > 0) {
                        profile.attachment = atttachments;
                    }
                }
            }
            // console.log(fetch, "Return sa profiles")
            return res.code(200).send({data:fetch, message: 'Fetched application profiles with attachments'})
            // if(res.sent) fetch = null;
            // return
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    delete: async (req:any, res:FastifyReply) => {
        try {
            if(!req.params._id) return res.send({message: "No Id passed", response: false})
            if(!mongoose.isValidObjectId(req.params._id)) return res.send({response: false, message: "is not a valid objectId"})
            let remove = await req.models.application_profile_model.findByIdAndDelete({_id: req.params._id})
            req.log.info(`removed data: ${remove}`)
            return res.code(200).send({data:remove, message: "application removed successfully"})
        } catch (error) {
            console.log(error)
            return res.code(400).send({message:`Something went wrong ERROR: ${error}`})
        }
    }
}

export const applied_items_controller = {
    fetch: async (req: any, res: FastifyReply) => {
        try {
            let fetch = await req.models.application_item_model.find({registration_id: req.session.registration_id})
            .populate('application_id')
            .populate({
                path: 'item_id',
                model: req.models.items_model,
                populate: {
                    path: "plantilla_id",
                    model: req.models.plantilla_model,
                    populate: [
                        {
                            path: "department_id",
                            select: "title",
                            model: req.models.department_model
                        },
                        {
                            path: "salaryGrade_id",
                            select: "step1",
                            model: req.models.salary_grades_model
                        }
                    ]
                }
            })
            .populate("assessment_period").lean();

            let notifsPromises = fetch.map(async (item: any) => {
                // Find notifications associated with the current item
                let notifications = await req.models.application_items_logs.find({ applied_item_id: item._id }).lean();
                // Create a new object combining the item and its notifications
                return { ...item, notifications };
            });
        
            // Wait for all promises to resolve
            let itemsWithNotifications = await Promise.all(notifsPromises);
            await res.code(200).send({data:itemsWithNotifications, message: 'Fetched applied items per user'})
            if(res.sent) fetch = null;
            return
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    }
}

export const items_controller = {
    fetch: async (req: any, res: FastifyReply) => {
        try {
            let fetch = await req.models.items_model.find({deleted: false})
            .select('_id assessment_period plantilla_id').lean();

            await req.models.items_model.populate(fetch, {
                path: 'plantilla_id',
                select: 'position itemCode',
                model: req.models.plantilla_model
            })
            await res.code(200).send({data:fetch, message: 'Fetched items'})
            if(res.sent) fetch = null;
            return
            
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
    fetchByOpenItem: async (req: any, res: FastifyReply) => {
        try {
            let activeAssessment = await req.models.assessment_period_model.findOne({opened: true}).lean();
            let fetch = await req.models.items_model.find({assessment_period: activeAssessment._id, deleted: false})
            .populate({
                path: "plantilla_id",
                model: req.models.plantilla_model,
                select: 'position itemCode salaryGrade_id',
                populate: 
                    {
                        path: "salaryGrade_id",
                        model: req.models.salary_grades_model
                    }
            })
            .populate('assessment_period').populate('requirements').populate('qs_education').populate('qs_eligibility').populate('qs_experience').populate('qs_training').lean();

            await res.code(200).send({data:fetch, message: 'Active items fetched'})
            if(res.sent) fetch = null;
            return
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    }
}

export const eligibility_controller = {
    fetch: async (req: any, res: FastifyReply) => {
        try {
            let fetch = await req.models.qualificationStandards_model.find({type: "Eligibility"}).lean();
            await res.code(200).send({data:fetch, message: 'Fetched eligibilities'})
            if(res.sent) fetch = null;
            return
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    }
}

export const assessment_period_controller = {
    fetch: async (req: any, res: FastifyReply) => {
        try {
            let fetch = await req.models.assessment_period_model.find().lean();
            await res.code(200).send({data:fetch, message: 'Fetched assessment period'})
            if(res.sent) fetch = null;
            return
        } catch (error){
            console.log(error)
            return res.code(400).send({message: `Something went wrong ERROR: ${error}`})
        }
    },
}


