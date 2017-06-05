import 'reflect-metadata';
import * as inversify from "inversify";
import { TYPE } from './Constant';
import { InversifySocketIOClient } from './InversifySocketIOClient';
import { IEventHandler } from './EventHandler';
import * as SocketIO from 'socket.io';

export class InversifySocketIOServer {
    private container: inversify.Container;
    public clientList: InversifySocketIOClient[];
    public server: SocketIO.Server;

    // Event listener
    private onConnectListener: Function;

    constructor(container: any) {
        this.container = container;
        this.onConnectListener = this.onConnect.bind(this);
    }

    public bind(srv: any): SocketIO.Server {
        this.clientList = [];
        this.server = SocketIO.listen(srv);

        this.server.on("connection", this.onConnectListener);

        return this.server;
    }

    // Events
    private onConnect(socket: SocketIO.Socket) {
        let client = this.container.get<InversifySocketIOClient>(TYPE.Client);
        
        // register event handlers
        for (let handler of this.container.getAll<IEventHandler>(TYPE.EventHandler)) {
            let name: string = Reflect.getMetadata(TYPE.EventHandler, handler.constructor);
            socket.on(name, handler.fire.bind(handler, client));
        }

        client.connect(this, socket);

        // push to client list
        this.clientList.push(client);

        // call .disconnect and remove from list when disconnect
        socket.on("disconnect", (reason: string) => {
            client.disconnect(reason);
            
            // remove from client list if available
            let index = this.clientList.indexOf(client);
            if (index >= 0) {
                this.clientList.splice(index, 1);
            }
        });
    }

}