"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** `{date}-{trackNumber}-{name}@{venue}.fileExtension`
 * date and name are the only required fields
 */
function default_1(filename) {
    const regex = /^(\d{4}-\d{2}-\d{2})-(?:(\d{2})-)?([^@]+)(?:@([^.\s]+))?.*$/;
    const match = filename.match(regex);
    if (!match) {
        throw new Error('Invalid filename format');
    }
    const [, date, trackNumber, name, venue] = match;
    return {
        date,
        trackNumber,
        name: name.replace(/\.[^.]+$/, '').replace(/-/g, ' '),
        venue: venue && venue.replace(/-/g, ' ')
    };
}
exports.default = default_1;
