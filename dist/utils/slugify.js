"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(text) {
    return text
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}
exports.default = default_1;
