"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Constant_1 = require("./Constant");
var SocketIO = require("socket.io");
var InversifySocketIOServer = (function () {
    function InversifySocketIOServer(container) {
        this.container = container;
        this.onConnectListener = this.onConnect.bind(this);
    }
    InversifySocketIOServer.prototype.bind = function (srv) {
        this.clientList = [];
        this.server = SocketIO.listen(srv);
        this.server.on("connection", this.onConnectListener);
        return this.server;
    };
    // Events
    InversifySocketIOServer.prototype.onConnect = function (socket) {
        var _this = this;
        var client = this.container.get(Constant_1.TYPE.Client);
        // register event handlers
        for (var _i = 0, _a = this.container.getAll(Constant_1.TYPE.EventHandler); _i < _a.length; _i++) {
            var handler = _a[_i];
            var name = Reflect.getMetadata(Constant_1.TYPE.EventHandler, handler.constructor);
            socket.on(name, handler.fire.bind(handler, client));
        }
        client.connect(this, socket);
        // push to client list
        this.clientList.push(client);
        // call .disconnect and remove from list when disconnect
        socket.on("disconnect", function (reason) {
            client.disconnect(reason);
            // remove from client list if available
            var index = _this.clientList.indexOf(client);
            if (index >= 0) {
                _this.clientList.splice(index, 1);
            }
        });
    };
    return InversifySocketIOServer;
}());
exports.InversifySocketIOServer = InversifySocketIOServer;
