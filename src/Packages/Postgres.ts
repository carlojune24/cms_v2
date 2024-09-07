import postgres, { Pool } from "pg";

import * as Util from "../Util";

export const connect = async () => {
    try {
        const pool:Pool = new postgres.Pool(Util.env.POSTGRES_CONFIG);
        console.log(`⚡️ [AIMS]: Postgres successfully connected!`);
        return abstractionLayer(pool);
    } catch (error) {
        console.error(`\n\n${error}\n\n⚡️ [AIMS]: Postgres failed to connect`);
    }
};

const query = Object.freeze({
    insert : (data:{ [key:string] : any }, callback:Function) => {
        const parameters = Object.keys(data).toString();
        const arguements = Object.keys(data).map((_, index) => `$${index+1}`).toString();
        const values = Object.values(data)
        return [callback(parameters, arguements), values];
    },
    update : (data:{ [key:string] : any }, where:string[], callback:Function) => {
        const arguements = Object.keys(data).map((obj,index) => { return `${obj} = $${index+1}` }).join(', ');  
        const values = Object.values(data);
        const all = [... values, ... where];
        const indexes = all.map((_, index) => { return index+1 });
        const whereIndex = indexes.splice(values.length, all.length);
        return [callback(arguements, whereIndex), all];
    }
});

const abstractionLayer = (pool:Pool) => {
    interface pageQuery { page:number, length:number };
    const defaultPageQuery = { page : 1, length : 1000 }; 

    const sample = { result : [{ test_message : 'Hello World from Postgres sample.' }] };

    return { sample };
}