/** `{date}-{trackNumber}-{name}@{venue}.fileExtension`
 * date and name are the only required fields
 */
export default function (filename: string): {
    date: string;
    trackNumber: string;
    name: string;
    venue: string;
};
