"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(key, arr) {
    return arr.sort((a, b) => {
        if (a[key] < b[key]) {
            return 1;
        }
        if (a[key] > b[key]) {
            return -1;
        }
        return 0;
    });
}
exports.default = default_1;
