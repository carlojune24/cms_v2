import mysql, { Pool } from "mysql";

import * as Util from "../Util";

export const connect = async () => {
    try {
        const pool:Pool = mysql.createPool(Util.env.MYSQL_CONFIG);
        console.log(`⚡️ [AIMS]: MySQL successfully connected!`);
        return abstractionLayer(pool);
    } catch (error) {
        console.error(`\n\n${error}\n\n⚡️ [AIMS]: MySQL failed to connect`);
    }
};

const abstractionLayer = (pool:Pool) => {
    interface pageQuery { page:number, length:number };
    const defaultPageQuery = { page : 1, length : 1000 };   

    const sample = { result : [{ test_message : 'Hello World from MySQL sample.' }] };
    
    return { sample };
}