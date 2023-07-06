"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(ms) {
    const s = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const m = Math.floor(ms / 1000 / 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
exports.default = default_1;
