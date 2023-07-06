"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortByKey_1 = __importDefault(require("./sortByKey"));
function default_1(baseHref, yearsDirectory, year, tracks) {
    let result = [];
    tracks.reduce((acc, { date, venue }) => {
        const existingTrack = acc.find(i => i.date === date && i.venue === venue);
        if (!existingTrack) {
            acc.push({ date, href: `${baseHref}#/${date}`, venue });
        }
        return acc;
    }, result);
    result = (0, sortByKey_1.default)('date', result);
    if (yearsDirectory) {
        result = result.filter(i => year && i.date.startsWith(year));
    }
    return result;
}
exports.default = default_1;
