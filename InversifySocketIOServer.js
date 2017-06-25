"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Constant_1 = require("./Constant");
var SocketIO = require("socket.io");
var InversifySocketIOServer = (function () {
    function InversifySocketIOServer(container) {
        this.container = container;
    }
    InversifySocketIOServer.prototype.bind = function (srv) {
        this.server = SocketIO.listen(srv);
        this.server.on("connection", this.onConnect.bind(this));
        return this.server;
    };
    // Events
    InversifySocketIOServer.prototype.onConnect = function (socket) {
        // register event handlers
        for (var _i = 0, _a = this.container.getAll(Constant_1.TYPE.EventHandler); _i < _a.length; _i++) {
            var handler = _a[_i];
            var name = Reflect.getMetadata(Constant_1.TYPE.EventHandler, handler.constructor);
            socket.on(name, handler.fire.bind(handler, socket));
        }
    };
    return InversifySocketIOServer;
}());
exports.InversifySocketIOServer = InversifySocketIOServer;
