import { candidate_controller } from "../controller/candidate_controller"
import { categories_controller } from "../controller/categories_controller"
import { event_controller } from "../controller/event.controller"
import { judges_controller } from "../controller/judges_controller"
import { rating_controller } from "../controller/rating_controller"
import { round_controller } from "../controller/round_controller"

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
    // event
    fastify.post('/event', event_controller.createEvent)
    fastify.put('/event', event_controller.updateEvent)
    fastify.delete('/event/:event_id', event_controller.deleteEvent)
    fastify.get("/events", event_controller.fetchAll)
    fastify.get("/event/:event_id", event_controller.fetchEvent)
    fastify.get("/eventJudges/:event_id", event_controller.fetchJudges)

    // judge
    fastify.get('/judges', judges_controller.fetchAll)
    fastify.post('/judge', judges_controller.createJudge)
    fastify.put('/judge', judges_controller.updateJudge);
    fastify.delete('/judge/:judge_id', judges_controller.deleteJudge)

    // candidate
    fastify.post('/candidate', candidate_controller.createCandidate)
    fastify.get('/candidatesByEventsID/:event_id', candidate_controller.fetchAllCandidatesByEventID)
    fastify.put('/candidate', candidate_controller.updateCandidate)
    fastify.delete('/candidate/:candidate_id', candidate_controller.deleteCandidate)

    // round
    fastify.get('/roundsByEventID/:event_id', round_controller.fetchAllRoundsByEventID)
    fastify.post('/round', round_controller.createRound)
    fastify.put('/addRemoveCandidateInRound', round_controller.AddRemoveCandidateInRound)
    fastify.put('/addDeductionInRoundCandidate', round_controller.addDeductionInRoundCandidate)
    fastify.put('/round', round_controller.updateRound);
    fastify.delete('/round/:round_id', round_controller.deleteRound)

    // categories
    fastify.get('/categoriesByRoundID/:round_id', categories_controller.fetchCategoryByRoundID)
    fastify.get('/categoriesByEventID/:event_id', categories_controller.fetchCategoryByEventID)
    fastify.post('/category', categories_controller.createCatergory)
    fastify.put('/category', categories_controller.updateCategory);
    fastify.delete('/category/:category_id', judges_controller.deleteJudge)

    // rating
    fastify.post('/rating', rating_controller.rateByCandidate)
    fastify.put('/rating', rating_controller.updateRateByCandidate)
    fastify.get('/rating/:event_id', rating_controller.ratingByEventID)
    fastify.get('/rating/:event_id/:judge_id', rating_controller.ratingByJudgeOnEvent)
    fastify.get('/category_rating/:category_id/:judge_id', rating_controller.ratingByJudgeOnEventCategory)
    
    done();
}