"use strict";
/** Possible paths:
 * basePath#
 * basePath#/YYYY
 * basePath#/YYYY-MM-DD
 * // basePath#/YYY-MM-DD-track-slug
 */
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(path) {
    const result = {};
    const segments = path.split('/').filter(Boolean);
    // Handle case of no path
    if (!segments.slice(-1)[0]) {
        return result;
    }
    const hasTrackSlug = !/^[0-9]/.test(segments.slice(-1)[0]);
    let dateSegment;
    if (hasTrackSlug) {
        result.trackSlug = segments.slice(-1)[0];
        dateSegment = segments.slice(-2)[0];
    }
    else {
        dateSegment = segments.slice(-1)[0];
    }
    if (dateSegment.length === 4) {
        result.year = dateSegment;
    }
    if (dateSegment.length > 9) {
        result.year = dateSegment.slice(0, 4);
        result.date = dateSegment.slice(0, 10);
    }
    return result;
}
exports.default = default_1;
