import { attendance_controller } from "../controller/attendance_controller";
import { config_controller } from "../controller/config_controller";
import { registration_controller } from "../controller/registration_controller";
import { application_controller, upload_attachment_controller, upload_profile_controller } from "../controller/system_controller";

export async function system_routes(fastify:any, opts:any, done:any) {
    //application
    fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true,
        limits: {
            fieldNameSize: 1*1024*1024, // Max field name size in bytes
            fieldSize: 2*1024*1024,     // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 40*1024*1024,  // For multipart forms, the max file size in bytes
            headerPairs: 2000,  // Max number of header key=>value pairs
            parts: 1000         // For multipart forms, the max number of parts (fields + files)
        } 
    })
    // registration
    fastify.post('/event', config_controller.event.createEvent);
    fastify.get('/events', config_controller.event.fetchAll);
    fastify.put('/event', config_controller.event.updateEvent);
    fastify.put('/activeEvent', config_controller.event.activeEvent);
    fastify.delete('/event/:event_id', config_controller.event.deleteEvent);
    fastify.put('/updateEventAttendanceType', config_controller.event.udpateEventAttendanceType);
    fastify.put('/addEventAttendanceType', config_controller.event.addEventAttendanceType);
    fastify.put('/removeEventAttendanceType', config_controller.event.removeEventAttendanceType);
    fastify.post('/attendanceById', attendance_controller.attendance_by_id);
    fastify.get('/attendancesByEvent/:event_id', attendance_controller.attendances_by_event);
    done();
}