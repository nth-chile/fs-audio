"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(input) {
    let result = input;
    if (!result.startsWith('/')) {
        result = '/' + result;
    }
    if (result.endsWith('/')) {
        result = result.replace(/\/$/, '');
    }
    return result;
}
exports.default = default_1;
