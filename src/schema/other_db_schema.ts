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

export const database = {
    connect: async () => {
        try {
            const server_connection = await mongoose.createConnection(env.city_db_uri, options).asPromise()
            if(server_connection.readyState !== 1) return false
            schema.salary_grades = new mongoose.Schema({}, {strict: false})
            const salary_grades_model = server_connection.model('salary_grades',schema.salary_grades)
            
            return {models:{
                    salary_grades_model
                }
            }
        } catch (error) {
            console.log("AN ERROR OCCURED IN MONGO", error)
            process.exit()
        }
    } 
}