import 'reflect-metadata';
import { TYPE } from './Constant';
import * as SocketIO from 'socket.io';

export interface IEventHandler {
    fire(client: SocketIO.Socket, data: any);
}

export function EventHandler(event: string) {
    return (target) => {
        Reflect.defineMetadata(TYPE.EventHandler, event, target);
    }
}