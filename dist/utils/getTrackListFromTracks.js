"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortByKey_1 = __importDefault(require("./sortByKey"));
// import slugify from "./slugify";
function default_1(baseHref, yearsDirectory, date, data) {
    return (0, sortByKey_1.default)('trackNumber', data, true)
        .filter(i => date && i.date.startsWith(date))
        .map(i => (Object.assign(Object.assign({}, i), { duration: '--:--', 
        // href: `${baseHref}#/${i.date}/${slugify(i.name)}`,
        href: `${baseHref}#/${i.date}`, isTrack: true })));
}
exports.default = default_1;
