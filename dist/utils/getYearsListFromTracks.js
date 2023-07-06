"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortByKey_1 = __importDefault(require("./sortByKey"));
function default_1(baseHref, tracks) {
    const years = new Set();
    tracks.forEach((track) => {
        const year = new Date(track.date).getFullYear();
        years.add(year.toString());
    });
    return (0, sortByKey_1.default)("year", [...years].map((year) => ({ href: `${baseHref}#/${year}`, year })));
}
exports.default = default_1;
