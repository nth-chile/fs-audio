/** `{date}-{trackNumber}-{name}@{venue}.fileExtension`
 * date and name are the only required fields
 */
export default function (filename: string) {
  const regex = /^(\d{4}-\d{2}-\d{2})-(?:(\d{2})-)?([^@]+)(?:@([^.\s]+))?.*$/;
  const match = filename.match(regex);

  if (!match) {
    throw new Error('Invalid filename format');
  }

  const [, date, trackNumber, name, venue] = match;

  return {
    date,
    trackNumber,
    name: name.replace(/_/g, ' '), 
    venue: venue && venue.replace(/_/g, ' ')
  };
}