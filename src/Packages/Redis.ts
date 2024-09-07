import { createClient } from "redis";

export const connect = async () => {
    try {
        const client = createClient();
        await client.connect();
        console.log(`⚡️ [AIMS]: Redis successfully connected!`);
        return client;
    } catch (error) {
        console.error(`\n\n${error}\n\n⚡️ [AIMS]: Postgres failed to connect`); 
        process.exit(-1);
    }
}