import { injectable } from 'inversify';
import { InversifySocketIOServer } from './InversifySocketIOServer';
import * as SocketIO from 'socket.io';

@injectable()
export abstract class InversifySocketIOClient {
    public socket: SocketIO.Socket;
    public server: InversifySocketIOServer;

    constructor() {
    }

    public connect(server: InversifySocketIOServer, socket: SocketIO.Socket) {
        this.socket = socket;
        this.server = server;
        
        this.onConnect();
    }

    public disconnect(reason?: string) {
        if (reason) {
            this.onDisconnect(reason);
        }
        else {
            this.socket.disconnect();
        }
    }

    public emit(event: string, data?: object) {
        this.socket.emit(event, data);
    }

    // ---
    protected abstract onConnect();
    protected abstract onDisconnect(reason: string);
}