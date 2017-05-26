import 'reflect-metadata';
import { InversifySocketIOClient } from './InversifySocketIOClient';
import { TYPE } from './Constant';

export interface IEventHandler {
    fire(client: InversifySocketIOClient, data: any);
}

export function EventHandler(event: string) {
    return (target) => {
        Reflect.defineMetadata(TYPE.EventHandler, event, target);
    }
}