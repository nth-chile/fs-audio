# fs-shows-web

## What is it?

fs-shows is a lib for making a React app similar to https://phishtracks.com or https://relisten.net without using a database. You can use it to browse and stream live music that is stored on a web server, cloud platform, storage bucket, etc.

The "fs" in "fs-shows" stands for filesystem. That's because the React app is built upon metadata parsed from filename of the tracks. There are a few reasons for this:

- Your backup location (assuming you use cloud storage) can also be the location your web player sources its content from
- It encourages you to keep your local copies organized. They'll always have consistent, informative, and alphabetical (by date and then optionally track number) names

## Filename format

_Note: it's the [getter](#getters)'s job to implement this spec_

- Format for filename is `{date}-{trackNumber}-{name}@{venue}`
  - `date` (required): YYYY-MM-DD
  - `trackNumber` (optional): two-digit number
  - `name` (required): name of track, using underscores for spaces
  - `venue` (optional): name of venue, using underscores for spaces
- Forward slashes in filenames should be URL encoded to `%2F`
- You can use folders however you want. The getters should find all files in the parent location

### Example

`any/path/to/2024-10-14-07-Drums%2FSpace@Connolly's_Pub.mp3`


## Getters

Each storage provider has its own API for fetching the files, so a different getter function is required for each storage provider. Getters must return `Promise<FSS.Track[]>`.
