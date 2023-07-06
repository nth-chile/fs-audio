import sortByKey from "./sortByKey";

type DateAndVenue = { date: string; href: string; venue?: string };

export default function (baseHref: string, yearsDirectory: boolean, year: string, tracks: FSS.Track[]): DateAndVenue[] {
  let result: DateAndVenue[] = [];

  tracks.reduce((acc: DateAndVenue[], { date, venue }: FSS.Track) => {
    const existingTrack = acc.find(
      i => i.date === date && i.venue === venue
    );

    if (!existingTrack) {
      acc.push({ date, href: `${baseHref}#/${date}`, venue });
    }

    return acc;
  }, result);

  result = sortByKey('date', result)

  if (yearsDirectory) {
    result = result.filter(i => year && i.date.startsWith(year));
  }

  return result
}
