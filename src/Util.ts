import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { FastifyRequest } from 'fastify';

export const env = Object.freeze({
    DEVMODE : false,                                 // turns off app.use() authorization check 
    BASEHREF : "/aims",
    FASTIFY_PORT : 2000,
    AIM_CONFIG : {
        username : 'admin',
        password : 'admin2022',
    },
    POSTGRES_CONFIG : {
        user:       "postgres",
        password:   "postgres",
        database:   "aims",
        host:       "localhost",
        port:       5432,
    },
    BCRYPT_SALT_ROUNDS : 10,
    SECRET_KEY : "7Fb0hhKzi8kQdhXP",
    UUID : 'ce0b6c83-8729-49ea-8c0e-efc2574e7ef8',  // used as AIMS service API uuid. DO NOT CHANGE. 
    IMAGE_DIRECTORY : "/home/ice/Documents/WEB/NGINX/resources/aims",
    USER_PICTURE_DIRECTORY : `service/images/`,
    SERVICE_PICTURE_DIRECTORY : `users/images/`,
});

export const rxjs = {
    observable() {
        const subscribers = new Set();
        const subscribe = (subscriber:Function) => {
            subscribers.add(subscriber);
            return { unsubscribe :  () => unsubscribe(subscriber) };
        }
        const next = (value:any) => subscribers.forEach((subscriber:any) => subscriber(value));
        const unsubscribe = (subscriber:Function) => subscribers.delete(subscriber);
        const clear = () =>  subscribers.clear();
        const length = () => subscribers.size;
        return { subscribe, next, unsubscribe, length, clear };
    },
    subject(initialValue:any = null) {
        let value = initialValue;
        const { next, ... stream} = rxjs.observable();
        const get = () => value;
        const set = (setValue:any) => {
            value = setValue || null;
            next(value);
        }
        const update = (callback:Function) => {
            value = callback(value) || value;
            next(value);
        };
        const subscribe = (callback:Function) => {
            callback(value);
            return stream.subscribe(callback);
        }
        return {...stream, subscribe, set, get, update };
    },
    combineLatest(sourceArray:(Rxjs.Observable | Rxjs.Subject)[]){
        const stream:Rxjs.Observable = rxjs.observable();
        const combinedValue:any[] = [];
        
        if (sourceArray.length > 0) sourceArray.forEach((source:Rxjs.Observable | Rxjs.Subject, index:number) => source.subscribe((value:any) => {
            combinedValue[index] = value;
            stream.next(combinedValue);
        }));

        return stream;
    },
    fromEvent : (element:HTMLElement, event:string) => {
        const source = rxjs.observable();
        element.addEventListener(event, (e) => source.next(e));
        return source;
    },
    pipe : (source:Rxjs.Observable | Rxjs.Subject, ...operators:Function[]) => {
        operators.forEach((operator:Function) => source = operator(source));
        return source;
    },
    interval : (ms:number = 1000) => {
        let count = 1;
        const source = rxjs.observable();
        setInterval(() => source.next(count++), ms);
        return source;
    },
    operators : Object.freeze({
        map : (callback:Function) => (source:Rxjs.Observable | Rxjs.Subject) => {
            let map = rxjs.observable();
            source.subscribe((stream:any) => map.next(callback(stream)));
            return map;
        },
        filter : (callback:Function) => (source:Rxjs.Observable | Rxjs.Subject) => {
            let filter = rxjs.observable();
            source.subscribe((stream:any) => (callback(stream)) && filter.next(stream));
            return filter;
        },
        tap : (callback:Function) => (source:Rxjs.Observable | Rxjs.Subject) => {
            source.subscribe(callback);
            return source;
        },
        switchMap : (callback:(data:any) => Rxjs.Observable | Rxjs.Subject) => (source:Rxjs.Observable | Rxjs.Subject) => {
            const switchMap = rxjs.observable();

            let running:null | Function = null;

            source.subscribe((data:any) => {
                if (running) running();
                const innerSource = callback(data);
                const subscription = (data:any) => switchMap.next(data);
                innerSource.subscribe(subscription);
                running = () => innerSource.unsubscribe(subscription);
            });

            return switchMap;
        },
        merge : (... arrayOfSources:(Rxjs.Observable | Rxjs.Subject)[]) => {
            let merge = rxjs.observable();
            if (arrayOfSources.length > 0) arrayOfSources.forEach((source:Rxjs.Observable | Rxjs.Subject) => source.subscribe((v:any) => merge.next(v)));
            return merge;
        }
    }),
}

export namespace Rxjs {
    export interface Observable {
        subscribe(callback:Function) : { unsubscribe : Function },
        next(value:any) : void,
        unsubscribe(callback:Function) : void,
        clear() : void,
        length() : void, 
    }
    export interface Subject extends Omit<Observable, 'next'> {
        set(newValue:any) : void, 
        get() : any, 
        update(callback:Function) : any,
    }
}

export const writeLog = ({ clientIPAddress, hostURI, errorMessage }:{ clientIPAddress:string, hostURI:string, errorMessage:string }) => {
    const logPath = path.join(__dirname, '../', 'logs.txt');

    fs.open(logPath, "r", (err) => { 
        const logText = `Created At: ${new Date()}\nClient IP Address: ${clientIPAddress}\nRequest URI: ${hostURI}\nError: ${errorMessage}\n\n`;

        if (err) try {
            const newLogFile = fs.createWriteStream(logPath);
            newLogFile.write(`OAuth log file created at ${new Date()}\n\n`);
            newLogFile.write(logText);
            newLogFile.end();
            return;
        } catch (fileErr) {
            return console.log('===== I/O ERROR =====\n\n', fileErr, '\n\n===== I/O ERROR =====\n');
        }

        return fs.appendFile(logPath, logText, 'utf-8', (ioError) => {
            if (ioError) console.log('===== I/O ERROR =====\n\n', ioError, '\n\n===== I/O ERROR =====\n');
        });
    });
}

export const tools = Object.freeze({
    jsonClone : (json:{ [key:string] : any }) => JSON.parse(JSON.stringify(json)),
    generate : Object.freeze({
        string(length:number) {
            let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz', result = '';
            for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
            return result;
        },
        uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0, v = (c == 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        sha256 : (fileLocation:string) => {
            const fileBuffer = fs.readFileSync(fileLocation);
            const hashSum = crypto.createHash('sha256');
        
            hashSum.update(fileBuffer);
        
            return hashSum.digest('hex');
        },
    }),
    capitalizeString : (string:string) => {
        let concat = "";
    
        string.split(" ").forEach((word:string, index:number, array:string[]) => {
            concat += `${word.charAt(0).toUpperCase()}${(word.length > 1) ? word.slice(1).toLowerCase() : ''}${index < (array.length-1) ? ' ' : ''}`;
        });
    
        return concat;
    },
});