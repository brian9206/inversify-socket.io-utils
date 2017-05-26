"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var InversifySocketIOClient = (function () {
    function InversifySocketIOClient() {
    }
    InversifySocketIOClient.prototype.connect = function (server, socket) {
        this.socket = socket;
        this.server = server;
        this.onConnect();
    };
    InversifySocketIOClient.prototype.disconnect = function (reason) {
        if (reason) {
            this.onDisconnect(reason);
        }
        else {
            this.socket.disconnect();
        }
    };
    InversifySocketIOClient.prototype.emit = function (event, data) {
        this.socket.emit(event, data);
    };
    return InversifySocketIOClient;
}());
InversifySocketIOClient = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], InversifySocketIOClient);
exports.InversifySocketIOClient = InversifySocketIOClient;
