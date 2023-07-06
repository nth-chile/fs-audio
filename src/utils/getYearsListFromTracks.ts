export default function (baseHref: string, tracks: FSS.Track[]): { year: string }[] {
  const years = new Set<string>()

  tracks.forEach((track) => {
    const year = new Date(track.date).getFullYear();
    years.add(year.toString());
  });

  return [...years].map((year) => ({ href: `${baseHref}#/${year}`, year }))
}