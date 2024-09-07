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
                attendance_types: [{
                    "name": String,
                    active: Boolean
                }],
                active: Boolean,
                active_event_type_id: String
            })

            schema.attendance = new mongoose.Schema( {
                event_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
                registration_id: { type: mongoose.Schema.Types.ObjectId, ref: 'registrations' },
                attendance_log: [
                    {
                        attendance_type_id:  { type: mongoose.Schema.Types.ObjectId},
                        date_time: Date
                    }
                ]
            })

            return {models:{
                registration: local_connection.model('registrations', schema.registration),
                organization: local_connection.model('organizations', schema.organizations),
                participation_type: local_connection.model('participation_types', schema.organizations),
                events: local_connection.model('events', schema.event),
                otp_model: local_connection.model('otps', schema.authOtp),
                attendance: local_connection.model('attendances', schema.attendance)
            }};
        } catch (error) {
            console.log("AN ERROR OCCURED IN MONGO", error)
            process.exit()
        }
    } 
}