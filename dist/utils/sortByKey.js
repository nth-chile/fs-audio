"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(key, arr, asc) {
    return arr.sort((a, b) => {
        if (a[key] < b[key]) {
            return asc ? -1 : 1;
        }
        if (a[key] > b[key]) {
            return asc ? 1 : -1;
        }
        return 0;
    });
}
exports.default = default_1;
