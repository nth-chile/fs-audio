/** Possible paths:
 * basePath
 * basePath/YYYY
 * basePath/YYYY-MM-DD
 * basePath/YYY-MM-DD-track-slug
 */
export type PathParts = {
    year?: string;
    date?: string;
    trackSlug?: string;
};
export default function (path: string): PathParts;
