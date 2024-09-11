import mongoose from 'mongoose'
import { env } from '../environment'

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

const schema:any = {}

export const systemDB = {
    connect: async () => {
        try {
            const local_connection = await mongoose.createConnection(env.mongo, options).asPromise()
            if(local_connection.readyState !== 1) return false

            schema.registration = new mongoose.Schema( {
                lname: String,
                fname: String,
                mname: String,
                ename: String,
                email: String,
                contact_no: String,
                course: String,
                organization: String,
                participation_type: String,
                access_code: String
            })

            schema.authOtp = new mongoose.Schema({
                email: String,
                contact_no: Number,
                otp: String,
                createdAt: Date
            })

            schema.organizations = new mongoose.Schema( {
                name: String
            })

            schema.participation_type = new mongoose.Schema( {
                name: String
            })

            schema.event = new mongoose.Schema( {
                name: String,
                date: Date,
                status: Boolean
            })

            schema.judges = new mongoose.Schema({
                name: String,
                access_code: String,
                events: [
                    {
                        event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' }
                    }
                ]
            });

            schema.attendance = new mongoose.Schema( {
                event_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                registration_id: { type: mongoose.Schema.Types.ObjectId, ref: 'registrations' },
                attendance_log: [
                    {
                        attendance_type_id:  { type: mongoose.Schema.Types.ObjectId},
                        date_time: Date
                    }
                ]
            });

            schema.candidates = new mongoose.Schema({
                name: String,
                event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
            })

            schema.rounds = new mongoose.Schema( {
                name: String,
                event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                candidates: [
                    {
                        candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates' },
                        deductions:[
                            {
                                name: String,
                                value: Number,
                                category_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
                            }
                        ]
                    }
                ]
            })

            schema.categories = new mongoose.Schema( {
                event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                round_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rounds' },
                name: String,
                criteria: [
                    {
                        name: String,
                        percentage: Number
                    }
                ]
            })

            schema.ratings = new mongoose.Schema( {
                event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                round_id: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rounds' },
                candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates' },
                judge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'judges' },
                rating: [{
                    criteria_id: { type: mongoose.Schema.Types.ObjectId},
                    score: Number
                }]
            })

            return {models:{
                
                events: local_connection.model('events', schema.event),
                judges: local_connection.model('judges', schema.judges),
                candidates: local_connection.model('candidates', schema.candidates),
                rounds: local_connection.model('rounds', schema.rounds),
                categories: local_connection.model('categories', schema.categories),
                ratings: local_connection.model('ratings', schema.ratings),
            }};
        } catch (error) {
            console.log("AN ERROR OCCURED IN MONGO", error)
            process.exit()
        }
    } 
}