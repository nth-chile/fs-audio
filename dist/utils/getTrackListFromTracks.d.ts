export default function (baseHref: string, yearsDirectory: boolean, date: string, data: FSS.Track[]): {
    duration: string;
    href: string;
    isTrack: boolean;
    date: string;
    name: string;
    src: string;
    trackNumber?: string | undefined;
    venue?: string | undefined;
}[];
