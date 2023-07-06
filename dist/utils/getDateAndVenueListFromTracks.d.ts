type DateAndVenue = {
    date: string;
    href: string;
    venue?: string;
};
export default function (baseHref: string, yearsDirectory: boolean, year: string, tracks: FSS.Track[]): DateAndVenue[];
export {};
