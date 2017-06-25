import 'reflect-metadata';
import * as inversify from "inversify";
import { TYPE } from './Constant';
import { IEventHandler } from './EventHandler';
import * as SocketIO from 'socket.io';

export class InversifySocketIOServer {
    private container: inversify.Container;
    public server: SocketIO.Server;

    constructor(container: any) {
        this.container = container;
    }

    public bind(srv: any): SocketIO.Server {
        this.server = SocketIO.listen(srv);
        this.server.on("connection", this.onConnect.bind(this));

        return this.server;
    }

    // Events
    private onConnect(socket: SocketIO.Socket) {
        // register event handlers
        for (let handler of this.container.getAll<IEventHandler>(TYPE.EventHandler)) {
            let name: string = Reflect.getMetadata(TYPE.EventHandler, handler.constructor);
            socket.on(name, handler.fire.bind(handler, socket));
        }
    }

}