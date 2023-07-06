"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(baseHref, tracks) {
    const years = new Set();
    tracks.forEach((track) => {
        const year = new Date(track.date).getFullYear();
        years.add(year.toString());
    });
    return [...years].map((year) => ({ href: `${baseHref}#/${year}`, year }));
}
exports.default = default_1;
