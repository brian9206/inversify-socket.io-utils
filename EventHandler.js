"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Constant_1 = require("./Constant");
function EventHandler(event) {
    return function (target) {
        Reflect.defineMetadata(Constant_1.TYPE.EventHandler, event, target);
    };
}
exports.EventHandler = EventHandler;
