import sortByKey from "./sortByKey";
// import slugify from "./slugify";

export default function (baseHref: string, yearsDirectory: boolean, date: string, data: FSS.Track[]) {
  return sortByKey('trackNumber', data, true)
    .filter(i => date && i.date.startsWith(date))
    .map(i => ({
      ...i,
      duration: '--:--',
      // href: `${baseHref}#/${i.date}/${slugify(i.name)}`,
      href: `${baseHref}#/${i.date}`,
      isTrack: true
    }))
}
